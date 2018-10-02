import { eth, txUtils } from 'decentraland-eth'
import { Log } from 'decentraland-commons'
import { Publication, PublicationService } from '../../src/Publication'
import { BlockTimestampService } from '../../src/BlockTimestamp'
import { contractAddresses, eventNames } from '../../src/ethereum'
import { isDuplicatedConstraintError } from '../../src/database'
import { PUBLICATION_STATUS } from '../../shared/publication'
import { getAssetTypeFromEvent, getAssetIdFromEvent } from './utils'

const log = new Log('publicationReducer')

export async function publicationReducer(event) {
  const { address } = event

  switch (address) {
    case contractAddresses.LegacyMarketplace:
    case contractAddresses.Marketplace: {
      await reduceMarketplace(event)
      break
    }
    default:
      break
  }
}

async function reduceMarketplace(event) {
  const { tx_hash, block_number, name, address } = event

  const assetType = getAssetTypeFromEvent(event)
  const assetId = await getAssetIdFromEvent(event)
  const blockTime = await new BlockTimestampService().getBlockTime(block_number)

  if (!assetId) return log.info(`[${name}] Invalid Asset Id`)

  switch (name) {
    case eventNames.AuctionCreated:
    case eventNames.OrderCreated: {
      const { seller, priceInWei, expiresAt } = event.args
      const contract_id = event.args.id

      if (!contract_id) {
        return log.info(`[${name}] Publication ${tx_hash} doesn't have an id`)
      }

      const exists = await Publication.count({ tx_hash, contract_id })
      if (exists) {
        return log.info(`[${name}] Publication ${tx_hash} already exists`)
      }
      log.info(`[${name}] Creating publication ${contract_id} for ${assetId}`)

      await Publication.delete({
        asset_id: assetId,
        owner: seller.toLowerCase(),
        status: PUBLICATION_STATUS.open
      })

      try {
        await Publication.insert({
          asset_type: assetType,
          asset_id: assetId,
          marketplace_address: address,
          status: PUBLICATION_STATUS.open,
          tx_status: txUtils.TRANSACTION_TYPES.confirmed,
          owner: seller.toLowerCase(),
          buyer: null,
          price: eth.utils.fromWei(priceInWei),
          expires_at: expiresAt,
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
    case eventNames.OrderSuccessful: {
      const { totalPrice, winner } = event.args
      const contract_id = event.args.id
      const Asset = new PublicationService().getPublicableAssetFromType(
        assetType
      )

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
        Asset.update({ owner: winner }, { id: assetId })
      ])
      break
    }
    case eventNames.OrderCancelled: {
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
