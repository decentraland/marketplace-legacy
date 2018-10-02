import { eth, txUtils } from 'decentraland-eth'
import { Log } from 'decentraland-commons'
import { Parcel } from '../../src/Asset'
import { Publication } from '../../src/Publication'
import { BlockTimestampService } from '../../src/BlockTimestamp'
import { contractAddresses, eventNames } from '../../src/ethereum'
import { isDuplicatedConstraintError } from '../../src/database'
import { PUBLICATION_STATUS } from '../../shared/publication'
import { getParcelIdFromEvent } from './utils'

const log = new Log('publicationReducer')

export async function publicationReducer(event) {
  const { address, name } = event

  const parcelId = await getParcelIdFromEvent(event)
  if (!parcelId) return log.info(`[${name}] Invalid Parcel Id`)

  switch (address) {
    case contractAddresses.LegacyMarketplace: {
      await reduceLegacyMarketplace(event)
      break
    }
    case contractAddresses.Marketplace: {
      await reduceMarketplace(event)
      break
    }
    default:
      break
  }
}

async function reduceLegacyMarketplace(event, parcelId) {
  const { tx_hash, block_number, name, address } = event

  const blockTime = await new BlockTimestampService().getBlockTime(block_number)

  switch (name) {
    case eventNames.AuctionCreated: {
      const { seller, priceInWei, expiresAt } = event.args
      const contract_id = event.args.id

      if (!contract_id) {
        return log.info(`[${name}] Publication ${tx_hash} doesn't have an id`)
      }

      const exists = await Publication.count({ tx_hash, contract_id })
      if (exists) {
        return log.info(`[${name}] Publication ${tx_hash} already exists`)
      }
      log.info(`[${name}] Creating publication ${contract_id} for ${parcelId}`)

      await Publication.delete({
        asset_id: parcelId,
        owner: seller.toLowerCase(),
        status: PUBLICATION_STATUS.open
      })

      try {
        await Publication.insert({
          tx_status: txUtils.TRANSACTION_TYPES.confirmed,
          status: PUBLICATION_STATUS.open,
          owner: seller.toLowerCase(),
          buyer: null,
          price: eth.utils.fromWei(priceInWei),
          asset_id: parcelId,
          expires_at: expiresAt,
          marketplace_address: address,
          asset_type: ASSET_TYPES.parcel, // old publications are always parcel
          block_time_created_at: blockTime,
          tx_hash,
          block_number,
          contract_id
        })
      } catch (error) {
        if (!isDuplicatedConstraintError(error)) throw error
        log.info(
          `[${name}] Publication of hash ${tx_hash} and id ${contract_id} already exists and it's not open`
        )
      }
      break
    }
    case eventNames.AuctionSuccessful: {
      const { totalPrice, winner } = event.args
      const contract_id = event.args.id

      if (!contract_id) {
        return log.info(`[${name}] Publication ${tx_hash} doesn't have an id`)
      }
      log.info(`[${name}] Publication ${contract_id} sold to ${winner}`)

      await Promise.all([
        Publication.update(
          {
            status: PUBLICATION_STATUS.sold,
            buyer: winner.toLowerCase(),
            price: eth.utils.fromWei(totalPrice),
            block_time_updated_at: blockTime
          },
          { contract_id }
        ),
        Parcel.update({ owner: winner }, { id: parcelId })
      ])
      break
    }
    case eventNames.AuctionCancelled: {
      const contract_id = event.args.id

      if (!contract_id) {
        return log.info(`[${name}] Publication ${tx_hash} doesn't have an id`)
      }
      log.info(`[${name}] Publication ${contract_id} cancelled`)

      await Publication.update(
        {
          status: PUBLICATION_STATUS.cancelled,
          block_time_updated_at: blockTime
        },
        { contract_id }
      )
      break
    }
    default:
      break
  }
}

async function reduceMarketplace(event) {
  console.log('reduceMarketplace', event)
}
