import { Log } from 'decentraland-commons'
import { getParcelIdFromEvent } from './utils'
import { Parcel, Estate } from '../../src/Asset'
import { BlockTimestampService } from '../../src/BlockTimestamp'
import { contractAddresses, eventNames } from '../../src/ethereum'
import { decodeMetadata } from '../../shared/asset'
import { isEqualCoords } from '../../shared/parcel'

const log = new Log('estateReducer')

export async function estateReducer(event) {
  const { address } = event

  switch (address) {
    case contractAddresses.EstateRegistry: {
      await reduceEstateRegistry(event)
      break
    }
    default:
      break
  }
}

async function reduceEstateRegistry(event) {
  const { tx_hash, block_number, name } = event

  switch (name) {
    case eventNames.EstateCreate: {
      const { _owner, _estateId, _data } = event.args

      const exists = await Estate.count({ token_id: _estateId })
      if (exists) {
        log.info(`[${name}] Estate with token id ${_estateId} already exists`)
        return
      }
      let data
      try {
        data = decodeMetadata(_data)
      } catch (e) {
        data = ''
      }

      log.info(
        `[${name}] Creating Estate with token id "${_estateId}" and owner "${_owner}"`
      )

      const last_transferred_at = await new BlockTimestampService().getBlockTime(
        block_number
      )
      await Estate.insert({
        id: _estateId,
        token_id: _estateId,
        owner: _owner.toLowerCase(),
        data: { ...data, parcels: [] },
        last_transferred_at,
        tx_hash
      })
      break
    }
    case eventNames.AddLand: {
      const parcelId = await getParcelIdFromEvent(event)
      if (!parcelId) return log.info(`[${name}] Invalid Parcel Id`)

      const { _estateId } = event.args
      const estate = await Estate.findByTokenId(_estateId)
      if (!estate)
        return log.info(
          `[${name}] Estate with token id ${_estateId} does not exist`
        )

      const coordinates = Parcel.splitId(parcelId)
      const parcel = { x: Number(coordinates[0]), y: Number(coordinates[1]) }

      log.info(
        `[${name}] Updating Estate with token id "${
          estate.token_id
        }" add land (${parcel.x},${parcel.y})`
      )
      if (!estate.data.parcels.find(p => isEqualCoords(p, parcel))) {
        await Estate.update(
          {
            data: {
              ...estate.data,
              parcels: [...estate.data.parcels, parcel]
            }
          },
          { token_id: estate.token_id }
        )
      }
      break
    }
    case eventNames.RemoveLand: {
      const parcelId = await getParcelIdFromEvent(event)
      if (!parcelId) return log.info(`[${name}] Invalid Parcel Id`)

      const { _estateId } = event.args
      const estate = await Estate.findByTokenId(_estateId)
      if (!estate) {
        return log.info(
          `[${name}] Estate with token id ${_estateId} does not exist`
        )
      }

      const coordinates = Parcel.splitId(parcelId)
      const parcel = { x: Number(coordinates[0]), y: Number(coordinates[1]) }

      log.info(
        `[${name}] Updating Estate with token id "${
          estate.token_id
        }" remove land (${parcel.x},${parcel.y})`
      )
      await Estate.update(
        {
          data: {
            ...estate.data,
            parcels: estate.data.parcels.filter(p => !isEqualCoords(p, parcel))
          }
        },
        { token_id: _estateId }
      )
      break
    }
    case eventNames.EstateTransfer: {
      const { _to, _tokenId } = event.args

      log.info(
        `[${name}] Transferring Estate with token id "${_tokenId}" ownership to "${_to}"`
      )
      const last_transferred_at = await new BlockTimestampService().getBlockTime(
        block_number
      )

      await Estate.update(
        { owner: _to.toLowerCase(), last_transferred_at },
        { token_id: _tokenId }
      )
      break
    }
    case eventNames.EstateUpdateOperator: {
      const { _assetId, _operator } = event.args
      const estate = await Estate.findByTokenId(_assetId)
      if (!estate) {
        return log.info(
          `[${name}] Estate with token id ${_assetId} does not exist`
        )
      }

      log.info(
        `[${name}] Updating Estate with token id "${
          estate.token_id
        }" new update operator: ${_operator}`
      )
      await Estate.update(
        { update_operator: _operator.toLowerCase() },
        { token_id: estate.token_id }
      )
      break
    }
    case eventNames.EstateUpdate: {
      const { _assetId, _data } = event.args
      const estate = await Estate.findByTokenId(_assetId)
      if (!estate) {
        return log.info(
          `[${name}] Estate with token id ${_assetId} does not exist`
        )
      }

      log.info(
        `[${name}] Updating Estate with token id "${
          estate.token_id
        }" data: ${_data}`
      )
      await Estate.update(
        { data: { ...estate.data, ...decodeMetadata(_data) } },
        { token_id: estate.token_id }
      )
      break
    }
    default:
      break
  }
}
