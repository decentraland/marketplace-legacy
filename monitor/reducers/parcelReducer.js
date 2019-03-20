import { contracts } from 'decentraland-eth'
import { Log, env } from 'decentraland-commons'

import { getParcelIdFromEvent } from './utils'
import { Parcel, Estate } from '../../src/Asset'
import { Publication } from '../../src/Listing'
import { Approval } from '../../src/Approval'
import { BlockTimestampService } from '../../src/BlockTimestamp'
import { Tile } from '../../src/Tile'
import { contractAddresses, eventNames } from '../../src/ethereum'
import { ASSET_TYPES } from '../../shared/asset'
import { isDuplicatedConstraintError } from '../../src/database'

const log = new Log('parcelReducer')
const shouldUpdateCache = parseInt(env.get('UPDATE_CACHE', 1), 10)

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
  const { name, block_number, address } = event
  const shouldOmitParcelId = event.name === eventNames.ApprovalForAll

  let parcelId

  if (!shouldOmitParcelId) {
    parcelId = await getParcelIdFromEvent(event)
    if (!parcelId) {
      return log.info(`[${name}] Invalid Parcel Id`)
    }
  }

  switch (name) {
    case eventNames.Update: {
      try {
        const args = event.args
        const data = contracts.LANDRegistry.decodeLandData(args.data)

        log.info(`[${name}] Updating "${parcelId}" with ${args.data}`)
        await Promise.all([
          Parcel.update({ data }, { id: parcelId }),
          Tile.update({ name: data.name }, { id: parcelId })
        ])
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
        {
          owner: to.toLowerCase(),
          update_operator: null,
          operator: null,
          last_transferred_at
        },
        { id: parcelId }
      )
      if (shouldUpdateCache) {
        await Tile.upsertAsset(parcelId, ASSET_TYPES.parcel)
      }
      break
    }
    case eventNames.Approval: {
      const { operator } = event.args
      try {
        log.info(
          `[${name}] Updating "${parcelId}": new operator is ${operator}`
        )
        await Parcel.update(
          { operator: operator.toLowerCase() },
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

    case eventNames.ApprovalForAll: {
      // operator and holder are inverted in the contact
      const holder = event.args.holder.toLowerCase()
      const operator = event.args.operator.toLowerCase()
      const authorized = event.args.authorized === 'true'

      try {
        log.info(
          `[${name}] ${holder} ${
            authorized ? 'set' : 'remove'
          } ${operator} as approved for all`
        )
        if (authorized) {
          await Approval.approveForAll(address, holder, operator)
        } else {
          await Approval.delete({
            token_address: address,
            owner: holder,
            operator
          })
        }
      } catch (error) {
        if (!isDuplicatedConstraintError(error)) throw error
        log.info(
          `[${name}] ${holder} has already set ${operator} as approved for all`
        )
      }
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
        if (shouldUpdateCache) {
          await Tile.upsertAsset(parcelId, ASSET_TYPES.parcel)
        }
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
        if (shouldUpdateCache) {
          await Tile.upsertAsset(parcelId, ASSET_TYPES.parcel)
        }
      } else {
        log.info(`[${name}] Estate with token id  ${_estateId} does not exist`)
      }
      break
    }
    default:
      break
  }
}
