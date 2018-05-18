import { contracts, eth, txUtils } from 'decentraland-eth'
import { Log } from 'decentraland-commons'
import { Parcel } from '../../src/Parcel'
import { Publication } from '../../src/Publication'
import { BlockchainEvent } from '../../src/BlockchainEvent'
import { BlockTimestampService } from '../../src/BlockTimestamp'
import { MarketplaceEvent } from '../../src/MarketplaceEvent'
import { isDuplicatedConstraintError } from '../../src/lib'

const log = new Log('processEvents')
let eventCache

export async function processEvents(fromBlock = 0) {
  const allBlockchainEvents = await BlockchainEvent.findFrom(fromBlock)
  const blockchainEvents = allBlockchainEvents.filter(
    event => !eventCache.get(event)
  )

  if (blockchainEvents.length) {
    log.info(`Persisting ${blockchainEvents.length} events`)

    for (const event of blockchainEvents) {
      await processEvent(event)
      eventCache.set(event)
    }
  } else {
    const lastBlockNumber = await BlockchainEvent.findLastBlockNumber()
    log.info(`No new events to persist. Last DB block: ${lastBlockNumber}`)
  }
}

export async function processEvent(event) {
  const { tx_hash: txHash, block_number: blockNumber, name } = event
  const { assetId } = event.args
  const parcelId = await Parcel.decodeAssetId(assetId)

  if (!parcelId) {
    // This only happens in dev, if there's a parcel in the DB that's outside of Genesis City
    log.info(`parcelId for assetId "${assetId}" is null`)
    return event
  }

  switch (name) {
    case BlockchainEvent.EVENTS.publicationCreated: {
      const { seller, priceInWei, expiresAt } = event.args
      const contractId = event.args.id
      const marketplace = new MarketplaceEvent(event)

      if (!contractId) {
        log.info(`[${name}] Publication ${txHash} doesn't have an id`)
        return null
      }

      const exists = await Publication.count({ tx_hash: txHash, contractId })
      if (exists) {
        log.info(`[${name}] Publication ${txHash} already exists`)
        return null
      }
      log.info(`[${name}] Creating publication ${contractId} for ${parcelId}`)

      const [blockTimeCreatedAt] = await Promise.all([
        new BlockTimestampService().getBlockTime(blockNumber),

        Publication.delete({
          asset_id: parcelId,
          owner: seller.toLowerCase(),
          status: Publication.STATUS.open
        })
      ])

      try {
        await Publication.insert({
          tx_hash: txHash,
          tx_status: txUtils.TRANSACTION_STATUS.confirmed,
          asset_id: parcelId,
          marketplace_id: marketplace.getId(),
          contract_id: contractId,
          status: Publication.STATUS.open,
          owner: seller.toLowerCase(),
          buyer: null,
          price: eth.utils.fromWei(priceInWei),
          expires_at: expiresAt,
          type: marketplace.getType(),
          block_number: blockNumber,
          block_time_created_at: blockTimeCreatedAt
        })
      } catch (error) {
        if (!isDuplicatedConstraintError(error)) throw error
        log.info(
          `[${name}] Publication of hash ${txHash} and id ${contractId} already exists and it's not open`
        )
      }
      break
    }
    case BlockchainEvent.EVENTS.publicationSuccessful: {
      const { totalPrice, winner } = event.args
      const contractId = event.args.id

      if (!contractId) {
        log.info(`[${name}] Publication ${txHash} doesn't have an id`)
        return null
      }

      log.info(`[${name}] Publication ${contractId} sold to ${winner}`)

      const blockTimeCreatedAt = await new BlockTimestampService().getBlockTime(
        blockNumber
      )

      await Promise.all([
        Publication.update(
          {
            status: Publication.STATUS.sold,
            buyer: winner.toLowerCase(),
            price: eth.utils.fromWei(totalPrice),
            block_time_updated_at: blockTimeCreatedAt
          },
          { contract_id: contractId }
        ),
        Parcel.update({ owner: winner }, { id: parcelId })
      ])
      break
    }
    case BlockchainEvent.EVENTS.publicationCancelled: {
      const contractId = event.args.id

      if (!contractId) {
        log.info(`[${name}] Publication ${txHash} doesn't have an id`)
        return null
      }
      log.info(`[${name}] Publication ${contractId} cancelled`)

      const blockTimeCreatedAt = await new BlockTimestampService().getBlockTime(
        blockNumber
      )

      await Publication.update(
        {
          status: Publication.STATUS.cancelled,
          block_time_updated_at: blockTimeCreatedAt
        },
        { contract_id: contractId }
      )
      break
    }
    case BlockchainEvent.EVENTS.parcelUpdate: {
      try {
        const { data } = event.args
        const attributes = { data: contracts.LANDRegistry.decodeLandData(data) }
        const attrsStr = JSON.stringify(attributes)

        log.info(`[${name}] Updating "${parcelId}" with ${attrsStr}`)
        await Parcel.update(attributes, { id: parcelId })
      } catch (error) {
        log.info(`[${name}] Skipping badly formed data for "${parcelId}"`)
      }
      break
    }
    case BlockchainEvent.EVENTS.parcelTransfer: {
      const { to } = event.args

      log.info(`[${name}] Updating "${parcelId}" owner with "${to}"`)

      const [lastTransferredAt] = await Promise.all([
        new BlockTimestampService().getBlockTime(blockNumber),
        Publication.cancelOlder(parcelId, blockNumber)
      ])
      await Parcel.update(
        { owner: to.toLowerCase(), last_transferred_at: lastTransferredAt },
        { id: parcelId }
      )
      break
    }
    default:
      log.info(`Don't know how to handle event ${event.name}`)
      break
  }

  return event
}

eventCache = {
  _values: {
    // [hash+name]: value
  },
  get(event) {
    return eventCache._values[eventCache.getKey(event)]
  },
  set(event) {
    eventCache._values[eventCache.getKey(event)] = true
  },
  getKey(event) {
    return event.tx_hash + event.name
  },
  size() {
    return Object.keys(eventCache._values).length
  }
}
