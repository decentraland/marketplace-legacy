import { contracts } from 'decentraland-eth'
import { Log } from 'decentraland-commons'
import { Parcel } from '../../src/Parcel'
import { Publication } from '../../src/Publication'
import { BlockTimestampService } from '../../src/BlockTimestamp'
import { getParcelIdFromEvent } from './utils'

const log = new Log('parcelReducer')

export async function parcelReducer(events, event) {
  const { block_number, name, normalizedName } = event
  const parcelId = await getParcelIdFromEvent(event)

  switch (normalizedName) {
    case events.parcelUpdate: {
      try {
        const { data } = event.args
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
    case events.parcelTransfer: {
      const { to } = event.args

      log.info(`[${name}] Transfering "${parcelId}" owner to "${to}"`)

      const [last_transferred_at] = await Promise.all([
        new BlockTimestampService().getBlockTime(block_number),
        Publication.cancelOlder(parcelId, block_number)
      ])

      await Parcel.update(
        { owner: to.toLowerCase(), last_transferred_at },
        { id: parcelId }
      )
      break
    }
    case events.addLand: {
      if (parcelId) {
        const { _estateId } = event.args
        log.info(
          `[${name}] Adding "${parcelId}" as part of the estate id "${_estateId}"`
        )

        await Parcel.update({ estate_id: _estateId }, { id: parcelId })
      }
      break
    }
    case events.removeLand: {
      if (parcelId) {
        const { _estateId } = event.args
        log.info(
          `[${name}] Removing "${parcelId}" as part of the estate id "${_estateId}"`
        )

        await Parcel.update({ estate_id: null }, { id: parcelId })
      }
      break
    }
    default:
      break
  }
}
