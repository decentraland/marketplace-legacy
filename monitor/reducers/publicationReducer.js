import { eth, txUtils } from 'decentraland-eth'
import { Log } from 'decentraland-commons'
import { Parcel } from '../../src/Parcel'
import { Publication } from '../../src/Publication'
import { BlockTimestampService } from '../../src/BlockTimestamp'
import { MarketplaceEvent } from '../../src/MarketplaceEvent'
import { isDuplicatedConstraintError } from '../../src/database'
import { PUBLICATION_STATUS } from '../../shared/publication'
import { getParcelIdFromEvent } from './utils'

const log = new Log('publicationReducer')

export async function publicationReducer(events, event) {
  const { tx_hash, block_number, name, normalizedName } = event
  const parcelId = await getParcelIdFromEvent(event)
  switch (normalizedName) {
    case events.publicationCreated: {
      const { seller, priceInWei, expiresAt } = event.args
      const contract_id = event.args.id
      const marketplace = new MarketplaceEvent(event)

      if (!contract_id) {
        log.info(`[${name}] Publication ${tx_hash} doesn't have an id`)
        return
      }

      const exists = await Publication.count({ tx_hash, contract_id })
      if (exists) {
        log.info(`[${name}] Publication ${tx_hash} already exists`)
        return
      }
      log.info(`[${name}] Creating publication ${contract_id} for ${parcelId}`)

      const [block_time_created_at] = await Promise.all([
        new BlockTimestampService().getBlockTime(block_number),

        Publication.delete({
          asset_id: parcelId,
          owner: seller.toLowerCase(),
          status: PUBLICATION_STATUS.open
        })
      ])

      try {
        await Publication.insert({
          tx_status: txUtils.TRANSACTION_STATUS.confirmed,
          status: PUBLICATION_STATUS.open,
          owner: seller.toLowerCase(),
          buyer: null,
          price: eth.utils.fromWei(priceInWei),
          asset_id: parcelId,
          expires_at: expiresAt,
          marketplace_id: marketplace.getId(),
          type: marketplace.getType(),
          tx_hash,
          block_number,
          block_time_created_at,
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
    case events.publicationSuccessful: {
      const { totalPrice, winner } = event.args
      const contract_id = event.args.id

      if (!contract_id) {
        log.info(`[${name}] Publication ${tx_hash} doesn't have an id`)
        return
      }

      log.info(`[${name}] Publication ${contract_id} sold to ${winner}`)

      const block_time_updated_at = await new BlockTimestampService().getBlockTime(
        block_number
      )

      await Promise.all([
        Publication.update(
          {
            status: PUBLICATION_STATUS.sold,
            buyer: winner.toLowerCase(),
            price: eth.utils.fromWei(totalPrice),
            block_time_updated_at
          },
          { contract_id }
        ),
        Parcel.update({ owner: winner }, { id: parcelId })
      ])
      break
    }
    case events.publicationCancelled: {
      const contract_id = event.args.id

      if (!contract_id) {
        log.info(`[${name}] Publication ${tx_hash} doesn't have an id`)
        return
      }
      log.info(`[${name}] Publication ${contract_id} cancelled`)

      const block_time_updated_at = await new BlockTimestampService().getBlockTime(
        block_number
      )

      await Publication.update(
        { status: PUBLICATION_STATUS.cancelled, block_time_updated_at },
        { contract_id }
      )
      break
    }
    default:
      break
  }
}
