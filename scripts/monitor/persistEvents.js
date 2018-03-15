import { eth, txUtils, contracts, Log } from 'decentraland-commons'
import { decodeAssetId, debounceEvent } from './utils'
import { Parcel } from '../../src/Parcel'
import { Publication } from '../../src/Publication'
import { BlockchainEvent } from '../../src/BlockchainEvent'

const log = new Log('persistEvents')

export async function persistEvents(lastBlockNumber = null, delay = 15000) {
  if (lastBlockNumber === null || lastBlockNumber === 'latest') {
    const lastBlockEvent = await BlockchainEvent.findLast()
    lastBlockNumber = lastBlockEvent ? lastBlockEvent.block_number : 0
  }

  const blockchainEvents = await BlockchainEvent.findFrom(+lastBlockNumber + 1)
  let i = 0

  if (blockchainEvents.length) {
    log.info(`Persisting events starting from block ${lastBlockNumber}`)

    for (; i < blockchainEvents.length; i++) {
      log.info(`Processing ${i + 1}/${blockchainEvents.length} events`)
      await processEvent(blockchainEvents[i])
    }

    lastBlockNumber = blockchainEvents[i - 1].block_number
  } else {
    log.info(`No new events to persist from block ${lastBlockNumber}`)
  }

  setTimeout(() => persistEvents(lastBlockNumber, delay), delay)
}

export async function processEvent(event) {
  const { tx_hash, block_number, name } = event
  const { assetId } = event.args
  const parcelId = await decodeAssetId(assetId)
  const [x, y] = Parcel.splitId(parcelId)

  switch (name) {
    case BlockchainEvent.EVENTS.publicationCreated: {
      const { seller, priceInWei, expiresAt } = event.args
      const contract_id = event.args.id

      const exists = await Publication.count({ tx_hash })
      if (exists) {
        log.info(`[${name}] Publication ${tx_hash} already exists`)
        return
      }
      if (!contract_id) {
        log.info(`[${name}] Publication ${tx_hash} doesn't have an id`)
        return
      }
      log.info(`[${name}] Creating publication ${contract_id} for ${parcelId}`)

      await Publication.insert({
        tx_status: txUtils.TRANSACTION_STATUS.confirmed,
        status: Publication.STATUS.open,
        owner: seller.toLowerCase(),
        buyer: null,
        price: eth.utils.fromWei(priceInWei),
        expires_at: new Date(parseInt(expiresAt, 10)),
        tx_hash,
        contract_id,
        x,
        y
      })
      break
    }
    case BlockchainEvent.EVENTS.publicationSuccessful: {
      const { totalPrice, winner } = event.args
      const contract_id = event.args.id

      if (!contract_id) {
        log.info(`[${name}] Publication ${tx_hash} doesn't have an id`)
        return
      }

      log.info(`[${name}] Publication ${contract_id} sold to ${winner}`)

      await Publication.update(
        {
          status: Publication.STATUS.sold,
          buyer: winner.toLowerCase(),
          price: eth.utils.fromWei(totalPrice)
        },
        { contract_id }
      )
      await Parcel.update({ owner: winner }, { id: parcelId })
      break
    }
    case BlockchainEvent.EVENTS.publicationCancelled: {
      const contract_id = event.args.id

      if (!contract_id) {
        log.info(`[${name}] Publication ${tx_hash} doesn't have an id`)
        return
      }
      log.info(`[${name}] Publication ${contract_id} cancelled`)

      await Publication.update(
        { status: Publication.STATUS.cancelled },
        { contract_id }
      )
      break
    }
    case BlockchainEvent.EVENTS.parcelUpdate: {
      try {
        const { data } = event.args
        const attributes = { data: contracts.LANDRegistry.decodeLandData(data) }

        debounceEvent(parcelId, name, () => {
          const attrsStr = JSON.stringify(attributes)
          log.info(`[${name}] Updating "${parcelId}" with ${attrsStr}`)

          Parcel.update(attributes, { id: parcelId })
        })
      } catch (error) {
        log.info(`[${name}] Skipping badly formed data for "${parcelId}"`)
      }
      break
    }
    case BlockchainEvent.EVENTS.parcelTransfer: {
      const { from, to } = event.args

      debounceEvent(parcelId, name, async () => {
        log.info(`[${name}] Updating "${parcelId}" owner with "${to}"`)

        await Publication.cancelOlder(x, y, block_number)
        await Parcel.update({ owner: to.toLowerCase() }, { id: parcelId })
      })
      break
    }
    default:
      log.info(`Don't know how to handle event ${event.name}`)
      break
  }

  return event
}
