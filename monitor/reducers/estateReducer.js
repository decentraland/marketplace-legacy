import { Log } from 'decentraland-commons'
import { Estate } from '../../src/Estate'
import { BlockTimestampService } from '../../src/BlockTimestamp'
import { getParcelIdFromEvent } from './utils'
import { Parcel } from '../../src/Parcel'
import { decodeMetadata } from '../../shared/asset'

const log = new Log('estateReducer')

export async function estateReducer(events, event) {
  const { tx_hash, block_number, name, normalizedName } = event
  const parcelId = await getParcelIdFromEvent(event)

  switch (normalizedName) {
    case events.estateCreate: {
      const { owner, estateId, metadata } = event.args

      const exists = await Estate.count({ asset_id: estateId })
      if (exists) {
        log.info(`[${name}] Estate ${estateId} already exists`)
        return
      }
      let data
      try {
        data = decodeMetadata(metadata)
      } catch (e) {
        data = ''
      }

      log.info(`[${name}] Creating Estate "${estateId}" with owner "${owner}"`)

      const last_transferred_at = await new BlockTimestampService().getBlockTime(
        block_number
      )
      await Estate.insert({
        id: estateId,
        asset_id: estateId,
        owner: owner.toLowerCase(),
        data: { ...data, parcels: [] },
        last_transferred_at,
        tx_hash
      })
      break
    }
    case events.addLand: {
      if (parcelId) {
        const { estateId } = event.args
        const estate = (await Estate.findByAssetId(estateId))[0]
        const coordinates = Parcel.splitId(parcelId)
        const x = parseInt(coordinates[0], 10)
        const y = parseInt(coordinates[1], 10)

        log.info(
          `[${name}] Updating Estate "${estate.asset_id}" add land (${x},${y})`
        )
        if (!estate.data.parcels.find(p => p.x === x && p.y === y)) {
          await Estate.update(
            {
              data: {
                ...estate.data,
                parcels: [...estate.data.parcels, { x, y }]
              }
            },
            { asset_id: estate.asset_id }
          )
        }
      }
      break
    }
    case events.removeLand: {
      if (parcelId) {
        const { estateId } = event.args
        const estate = (await Estate.findByAssetId(estateId))[0]
        const [x, y] = Parcel.splitId(parcelId)
        log.info(
          `[${name}] Updating Estate "${
            estate.asset_id
          }" remove land (${x},${y})`
        )
        await Estate.update(
          {
            data: {
              ...estate.data,
              parcels: estate.data.parcels.filter(
                p => p.x !== parseInt(x, 10) || p.y !== parseInt(y, 10)
              )
            }
          },
          { asset_id: estateId }
        )
      }
      break
    }
    case events.estateTransfer: {
      const { to, estateId } = event.args

      log.info(`[${name}] Transfering "${estateId}" owner to "${to}"`)

      const last_transferred_at = await new BlockTimestampService().getBlockTime(
        block_number
      )

      await Estate.update(
        { owner: to.toLowerCase(), last_transferred_at },
        { asset_id: estateId }
      )
      break
    }
    case events.estateUpdate: {
      const { assetId, data } = event.args

      const estate = (await Estate.findByAssetId(assetId))[0]

      log.info(`[${name}] Updating Estate "${estate.asset_id}" data: ${data}`)

      await Estate.update(
        {
          data: {
            ...estate.data,
            ...decodeMetadata(data)
          }
        },
        { asset_id: estate.asset_id }
      )
      break
    }
    default:
      break
  }
}
