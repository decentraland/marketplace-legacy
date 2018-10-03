import { Log } from 'decentraland-commons'
import { getParcelIdFromEvent } from './utils'
import { Parcel, Estate } from '../../src/Asset'
import { Publication } from '../../src/Publication'
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
    case eventNames.CreateEstate: {
      const { _owner, _estateId, _data } = event.args

      const exists = await Estate.count({ id: _estateId })
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
        return log.info(`[${name}] Estate with id: ${_estateId} does not exist`)

      const [x, y] = Parcel.splitId(parcelId)
      const parcel = { x: Number(x), y: Number(y) }

      log.info(
        `[${name}] Updating Estate id: "${estate.id}" add land (${parcelId})`
      )
      if (!estate.data.parcels.find(p => isEqualCoords(p, parcel))) {
        await Estate.update(
          {
            data: {
              ...estate.data,
              parcels: [...estate.data.parcels, parcel]
            }
          },
          { id: estate.id }
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

      const [x, y] = Parcel.splitId(parcelId)
      const parcel = { x: Number(x), y: Number(y) }

      log.info(
        `[${name}] Updating Estate id: "${estate.id}" remove land (${parcelId})`
      )
      await Estate.update(
        {
          data: {
            ...estate.data,
            parcels: estate.data.parcels.filter(p => !isEqualCoords(p, parcel))
          }
        },
        { id: estate.id }
      )
      break
    }
    case eventNames.Transfer: {
      const { _to } = event.args
      const estateId = event.args._tokenId

      log.info(
        `[${name}] Transferring Estate with token id "${estateId}" ownership to "${_to}"`
      )

      const [last_transferred_at] = await Promise.all([
        new BlockTimestampService().getBlockTime(block_number),
        Publication.cancelOlder(estateId, block_number, eventNames.OrderCreated)
      ])

      await Estate.update(
        { owner: _to.toLowerCase(), last_transferred_at },
        { id: estateId }
      )
      break
    }
    case eventNames.UpdateOperator: {
      const { _operator } = event.args
      const estateId = event.args._assetId

      log.info(
        `[${name}] Updating Estate id: "${estateId}" operator: ${_operator}`
      )
      await Estate.update(
        { update_operator: _operator.toLowerCase() },
        { id: estateId }
      )
      break
    }
    case eventNames.Update: {
      const { _assetId, _data } = event.args
      const estate = await Estate.findByTokenId(_assetId)
      if (!estate) {
        return log.info(
          `[${name}] Estate with token id ${_assetId} does not exist`
        )
      }

      log.info(`[${name}] Updating Estate id: "${estate.id}" data: ${_data}`)
      await Estate.update(
        { data: { ...estate.data, ...decodeMetadata(_data) } },
        { id: estate.id }
      )
      break
    }
    default:
      break
  }
}
