import { contracts } from 'decentraland-eth'
import { Log } from 'decentraland-commons'
import { Parcel, Estate } from '../../src/Asset'
import { Publication } from '../../src/Publication'
import { BlockTimestampService } from '../../src/BlockTimestamp'
import { contractAddresses, eventNames } from '../../src/ethereum'
import { getParcelIdFromEvent } from './utils'

const log = new Log('parcelReducer')

export async function parcelReducer(event) {
  const { address } = event

  switch (address) {
    case contractAddresses.LANDRegistry: {
      await reduceLANDRegistry(event)
      break
    }
    case contractAddresses.EstateRegistry: {
      await reduceEstateRegistry(event)
      break
    }
    default:
      break
  }
}

async function reduceLANDRegistry(event) {
  const { name, block_number } = event

  const parcelId = await getParcelIdFromEvent(event)
  if (!parcelId) return log.info(`[${name}] Invalid Parcel Id`)

  switch (name) {
    case eventNames.Update: {
      const { data } = event.args

      try {
        const attributes = {
          data: contracts.LANDRegistry.decodeLandData(data)
        }
        const attrsStr = JSON.stringify(attributes)

        log.info(`[${name}] Updating "${parcelId}" with ${attrsStr}`)
        await Parcel.update(attributes, { id: parcelId })
      } catch (error) {
        log.info(`[${name}] Skipping badly formed data for "${parcelId}"`)
      }
      break
    }
    case eventNames.UpdateOperator: {
      const { operator } = event.args

      try {
        log.info(
          `[${name}] Updating "${parcelId}": new update operator is ${operator}`
        )
        await Parcel.update(
          { update_operator: operator.toLowerCase() },
          { id: parcelId }
        )
      } catch (error) {
        log.info(
          `[${name}] Skipping badly formed data for "${parcelId}" -- ${
            error.stack
          }`
        )
      }
      break
    }
    case eventNames.Transfer: {
      const { to } = event.args

      log.info(
        `[${name}] Transferring parcel "${parcelId}" ownership to "${to}"`
      )

      const [last_transferred_at] = await Promise.all([
        new BlockTimestampService().getBlockTime(block_number),
        Publication.cancelOlder(
          parcelId,
          block_number,
          eventNames.AuctionCreated
        ),
        Publication.cancelOlder(parcelId, block_number, eventNames.OrderCreated)
      ])
      await Parcel.update(
        { owner: to.toLowerCase(), last_transferred_at },
        { id: parcelId }
      )
      break
    }
    default:
      break
  }
}

async function reduceEstateRegistry(event) {
  const { name } = event

  switch (name) {
    case eventNames.AddLand: {
      const parcelId = await getParcelIdFromEvent(event)
      if (!parcelId) return log.info(`[${name}] Invalid Parcel Id`)
      const { _estateId } = event.args
      const estate = await Estate.findByTokenId(_estateId)
      if (estate) {
        log.info(
          `[${name}] Adding "${parcelId}" as part of the estate with token id "${_estateId}"`
        )

        await Parcel.update({ estate_id: _estateId }, { id: parcelId })
      } else {
        log.info(`[${name}] Estate with token id ${_estateId} does not exist`)
      }
      break
    }
    case eventNames.RemoveLand: {
      const parcelId = await getParcelIdFromEvent(event)
      if (!parcelId) return log.info(`[${name}] Invalid Parcel Id`)
      const { _estateId } = event.args
      const estate = await Estate.findByTokenId(_estateId)
      if (estate) {
        log.info(
          `[${name}] Removing "${parcelId}" as part of the estate with token id "${_estateId}"`
        )

        await Parcel.update({ estate_id: null }, { id: parcelId })
      } else {
        log.info(`[${name}] Estate with token id  ${_estateId} does not exist`)
      }
      break
    }
    default:
      break
  }
}
