import { eth, txUtils, contracts, Log } from 'decentraland-commons'
import { decodeAssetId, debounceById } from './utils'
import { Parcel } from '../../src/Parcel'
import { Publication } from '../../src/Publication'
import { BlockchainEvent } from '../../src/BlockchainEvent'

const log = new Log('persistEvents')

export async function persistEvents(lastBlockNumber = null, delay = 15000) {
  if (lastBlockNumber === null || lastBlockNumber === 'latest') {
    const lastBlockEvent = await BlockchainEvent.findLast()
    lastBlockNumber = lastBlockEvent ? lastBlockEvent.block_number : 0
  }

  const blockchainEvents = await BlockchainEvent.findFrom(lastBlockNumber + 1)
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
  const { tx_hash, block_number } = event
  const { assetId } = event.args
  const id = await decodeAssetId(assetId)
  const [x, y] = Parcel.splitId(id)

  switch (event.name) {
    case 'AuctionCreated': {
      const { creator, priceInWei, expiresAt } = event.args

      const exists = await Publication.count({ tx_hash })
      if (exists) {
        log.info(`[AuctionCreated] Publication ${tx_hash} already exists`)
        return
      }
      log.info(`[AuctionCreated] Creating publication for ${x},${y}`)

      await Publication.insert({
        tx_hash,
        tx_status: txUtils.TRANSACTION_STATUS.confirmed,
        status: Publication.STATUS.open,
        owner: creator.toLowerCase(),
        buyer: null,
        price: eth.utils.fromWei(priceInWei),
        expires_at: new Date(parseInt(expiresAt, 10)),
        x,
        y
      })
      break
    }
    case 'AuctionSuccessful': {
      const { totalPrice, winner } = event.args

      log.info(`[AuctionSuccessful] Publication ${id} sold to ${winner}`)

      await Publication.update(
        {
          status: Publication.STATUS.sold,
          buyer: winner.toLowerCase(),
          price: eth.utils.fromWei(totalPrice)
        },
        { x, y }
      )
      await Parcel.update({ owner: winner }, { id })
      break
    }
    case 'AuctionCancelled': {
      log.info(`[AuctionCancelled] Publication ${id} cancelled`)

      await Publication.update(
        { status: Publication.STATUS.cancelled },
        { x, y }
      )
      break
    }
    case 'Update': {
      try {
        const { data } = event.args
        const attributes = { data: contracts.LANDRegistry.decodeLandData(data) }

        debounceById(id, () => {
          const attrsStr = JSON.stringify(attributes)
          log.info(`[Update] Updating "${id}" with ${attrsStr}`)

          Parcel.update(attributes, { id })
        })
      } catch (error) {
        log.info(`[Update] Skipping badly formed data for "${id}"`)
      }
      break
    }
    case 'Transfer': {
      const { to } = event.args

      debounceById(id, async () => {
        log.info(`[Transfer] Updating "${id}" owner with "${to}"`)
        const publicationHashes = await BlockchainEvent.findOlderTxHashes(
          'AuctionCreated',
          block_number
        )
        await Publication.updateManyStatus(
          Publication.STATUS.cancelled,
          publicationHashes
        )

        await Parcel.update({ owner: to.toLowerCase() }, { id })
      })
      break
    }
    default:
    log.info(`Don't know how to handle event ${event.name}`)
      break
  }

  return event
}
