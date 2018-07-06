import { contracts } from 'decentraland-eth'
import { Log } from 'decentraland-commons'
import { Parcel } from '../../src/Parcel'
import { Publication } from '../../src/Publication'
import { BlockchainEvent } from '../../src/BlockchainEvent'
import { BlockTimestampService } from '../../src/BlockTimestamp'
import { getParcelIdFromEvent } from './utils'

const log = new Log('parcelReducer')

export async function parcelReducer(event) {
  const { block_number, name } = event
  const parcelId = await getParcelIdFromEvent(event)

  switch (name) {
    case BlockchainEvent.EVENTS.parcelUpdate: {
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
    case BlockchainEvent.EVENTS.parcelTransfer: {
      const { to } = event.args

      log.info(`[${name}] Updating "${parcelId}" owner with "${to}"`)

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
    default:
      break
  }
}
