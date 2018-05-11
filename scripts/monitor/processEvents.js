import { contracts, eth, txUtils } from 'decentraland-eth'
import { Log } from 'decentraland-commons'
import { Parcel } from '../../src/Parcel'
import { Publication } from '../../src/Publication'
import { BlockchainEvent } from '../../src/BlockchainEvent'
import { BlockTimestampService } from '../../src/BlockTimestamp'
import { Mortgage } from '../../src/Mortgage'
import { isDuplicatedConstraintError } from '../../src/lib'

const log = new Log('processEvents')

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
  const { tx_hash, block_number, name } = event
  const { assetId, landId } = event.args
  const parcelId = await Parcel.decodeAssetId(assetId || landId) // TODO: uaf
  if (!parcelId) {
    // This only happens in dev, if there's a parcel in the DB that's outside of Genesis City
    log.info(`parcelId for assetId "${assetId}" is null`)
    return event
  }
  const [x, y] = Parcel.splitId(parcelId)

  switch (name) {
    case BlockchainEvent.EVENTS.publicationCreated: {
      const { seller, priceInWei, expiresAt } = event.args
      const contract_id = event.args.id

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
          x,
          y,
          owner: seller.toLowerCase(),
          status: Publication.STATUS.open
        })
      ])

      try {
        await Publication.insert({
          tx_status: txUtils.TRANSACTION_STATUS.confirmed,
          status: Publication.STATUS.open,
          owner: seller.toLowerCase(),
          buyer: null,
          price: eth.utils.fromWei(priceInWei),
          expires_at: expiresAt,
          tx_hash,
          block_number,
          block_time_created_at,
          contract_id,
          x,
          y
        })
      } catch (error) {
        if (!isDuplicatedConstraintError(error)) throw error
        log.info(
          `[${name}] Publication of hash ${tx_hash} and id ${contract_id} already exists and it's not open`
        )
      }
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

      const block_time_updated_at = await new BlockTimestampService().getBlockTime(
        block_number
      )

      await Promise.all([
        Publication.update(
          {
            status: Publication.STATUS.sold,
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
    case BlockchainEvent.EVENTS.publicationCancelled: {
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
        { status: Publication.STATUS.cancelled, block_time_updated_at },
        { contract_id }
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

      const [last_transferred_at] = await Promise.all([
        new BlockTimestampService().getBlockTime(block_number),
        Publication.cancelOlder(x, y, block_number)
      ])
      await Parcel.update(
        { owner: to.toLowerCase(), last_transferred_at },
        { id: parcelId }
      )
      break
    }
    case BlockchainEvent.EVENTS.newMortgage: {
      const { borrower, loanId, mortgageId } = event.args
      const contract_id = event.args.id
      const rcnEngineContract = await eth.getContract('RCNEngine')
      const [amount, duesIn, expiresAt] = await Promise.all([
        await rcnEngineContract.getAmount(eth.utils.toBigNumber(loanId)),
        await rcnEngineContract.getDuesIn(eth.utils.toBigNumber(loanId)),
        await rcnEngineContract.getExpirationRequest(
          eth.utils.toBigNumber(loanId)
        )
      ])
      // TODO: remove this shit!
      console.log(
        loanId,
        amount,
        duesIn,
        expiresAt,
        amount.toNumber(),
        duesIn.toNumber(),
        expiresAt.toNumber()
      )

      const exists = await Mortgage.count({ tx_hash })
      if (exists) {
        log.info(`[${name}] Mortgage ${tx_hash} already exists`)
        return
      }
      log.info(`[${name}] Creating Mortgage ${mortgageId} for ${parcelId}`)

      const block_time_created_at = await Promise.resolve(
        new BlockTimestampService().getBlockTime(block_number)
      )
      try {
        await Mortgage.insert({
          tx_status: txUtils.TRANSACTION_STATUS.confirmed,
          status: Mortgage.STATUS.open,
          dues_in: duesIn.toNumber(),
          expires_at: expiresAt.toNumber(),
          mortgage_id: Number(mortgageId),
          loan_id: Number(loanId),
          block_number,
          block_time_created_at,
          amount: eth.utils.fromWei(amount),
          tx_hash,
          x,
          y,
          borrower
        })
      } catch (error) {
        if (!isDuplicatedConstraintError(error)) throw error
        log.info(
          `[${name}] Publication of hash ${tx_hash} and id ${contract_id} already exists and it's not open`
        )
      }
      break
    }
    default:
      log.info(`Don't know how to handle event ${event.name}`)
      break
  }

  return event
}

const eventCache = {
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
