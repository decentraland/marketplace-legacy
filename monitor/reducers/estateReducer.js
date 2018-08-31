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
      const { _owner, _estateId, _data } = event.args

      const exists = await Estate.count({ asset_id: _estateId })
      if (exists) {
        log.info(`[${name}] Estate ${_estateId} already exists`)
        return
      }
      let data
      try {
        data = decodeMetadata(_data)
      } catch (e) {
        data = ''
      }

      log.info(
        `[${name}] Creating Estate "${_estateId}" with owner "${_owner}"`
      )

      const last_transferred_at = await new BlockTimestampService().getBlockTime(
        block_number
      )
      await Estate.insert({
        id: _estateId,
        asset_id: _estateId,
        owner: _owner.toLowerCase(),
        data: { ...data, parcels: [] },
        last_transferred_at,
        tx_hash
      })
      break
    }
    case events.addLand: {
      if (parcelId) {
        const { _estateId } = event.args
        const estate = (await Estate.findByAssetId(_estateId))[0]
        if (estate) {
          const coordinates = Parcel.splitId(parcelId)
          const x = parseInt(coordinates[0], 10)
          const y = parseInt(coordinates[1], 10)

          log.info(
            `[${name}] Updating Estate "${
              estate.asset_id
            }" add land (${x},${y})`
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
        } else {
          log.info(`[${name}] Estate id ${_estateId} does not exist`)
        }
      }
      break
    }
    case events.removeLand: {
      if (parcelId) {
        const { _estateId } = event.args
        const estate = (await Estate.findByAssetId(_estateId))[0]
        if (estate) {
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
            { asset_id: _estateId }
          )
        } else {
          log.info(`[${name}] Estate id ${_estateId} does not exist`)
        }
      }
      break
    }
    case events.estateTransfer: {
      const { _to, _tokenId } = event.args

      log.info(`[${name}] Transfering "${_tokenId}" owner to "${_to}"`)

      const last_transferred_at = await new BlockTimestampService().getBlockTime(
        block_number
      )

      await Estate.update(
        { owner: _to.toLowerCase(), last_transferred_at },
        { asset_id: _tokenId }
      )
      break
    }
    case events.estateUpdate: {
      const { _assetId, _data } = event.args

      const estate = (await Estate.findByAssetId(_assetId))[0]
      if (estate) {
        log.info(
          `[${name}] Updating Estate "${estate.asset_id}" data: ${_data}`
        )

        await Estate.update(
          {
            data: {
              ...estate.data,
              ...decodeMetadata(_data)
            }
          },
          { asset_id: estate.asset_id }
        )
      } else {
        log.info(`[${name}] Estate id ${_assetId} does not exist`)
      }
      break
    }
    default:
      break
  }
}
