import { Log } from 'decentraland-commons'
import { eth } from 'decentraland-eth'

import { getAssetTypeFromEvent, getAssetIdFromEvent } from './utils'
import { BlockTimestampService } from '../../src/BlockTimestamp'
import { contractAddresses, eventNames } from '../../src/ethereum'
import { isDuplicatedConstraintError } from '../../src/database'
import { Bid } from '../../src/Listing'
import { LISTING_STATUS } from '../../shared/listing'

const log = new Log('bidReducer')

export async function bidReducer(event) {
  const { address } = event

  switch (address) {
    case contractAddresses.EstateRegistry:
    case contractAddresses.ERC721Bid: {
      await reduceBid(event)
      break
    }
    default:
      break
  }
}

async function reduceBid(event) {
  const { name, block_number } = event
  const assetType = getAssetTypeFromEvent(event)
  const [assetId, blockTime] = await Promise.all([
    getAssetIdFromEvent(event),
    new BlockTimestampService().getBlockTime(block_number)
  ])

  if (!assetId) {
    return log.info(`[${name}] Invalid Asset Id`)
  }

  switch (name) {
    case eventNames.BidCreated: {
      const {
        _id,
        _tokenAddress,
        _tokenId,
        _bidder,
        _price,
        _expiresAt,
        _fingerprint
      } = event.args

      const exists = await Bid.count({ id: _id })
      if (exists) {
        return log.info(`[${name}] Bid ${_id} already exist`)
      }

      log.info(
        `[${name}] Creating bid ${_id} for token with address: ${_tokenAddress} and id: ${_tokenId}`
      )

      await Bid.delete({
        token_address: _tokenAddress,
        token_id: _tokenId,
        bidder: _bidder.toLowerCase(),
        status: LISTING_STATUS.open
      })

      try {
        await Bid.insert({
          id: _id,
          token_address: _tokenAddress,
          token_id: _tokenId,
          bidder: _bidder,
          price: eth.utils.fromWei(_price),
          expires_at: _expiresAt,
          fingerprint: _fingerprint,
          asset_type: assetType,
          asset_id: assetId,
          block_time_created_at: blockTime,
          status: LISTING_STATUS.open,
          seller: null
        })
      } catch (error) {
        if (!isDuplicatedConstraintError(error)) {
          throw error
        }
        log.info(`[${name}] bid ${_id} already exists and it's not open`)
      }
      break
    }
    case eventNames.BidAccepted: {
      const { _id, _tokenAddress, _tokenId, _seller } = event.args

      log.info(`[${name}] Bid ${_id} accepted`)

      await Bid.update(
        {
          seller: _seller,
          status: LISTING_STATUS.sold,
          block_time_updated_at: blockTime
        },
        { id: _id }
      )

      await Bid.invalidateBids(_tokenAddress, _tokenId, blockTime)
      break
    }
    case eventNames.BidCancelled: {
      const id = event.args._id

      log.info(`[${name}] Bid ${id} cancelled`)

      await Bid.update(
        {
          status: LISTING_STATUS.cancelled,
          block_time_updated_at: blockTime
        },
        { id }
      )
      break
    }
    case eventNames.RemoveLand:
    case eventNames.AddLand: {
      const { _estateId } = event.args

      const bids = await Bid.getWithStatuses(
        contractAddresses.EstateRegistry,
        _estateId,
        [LISTING_STATUS.open, LISTING_STATUS.fingerprintChanged]
      )

      const estateHasActiveBids = bids.length > 0

      if (estateHasActiveBids) {
        log.info(
          `[${name}] Updating bids for the Estate ${_estateId}, fingerprint changed`
        )

        const estateContract = eth.getContract('EstateRegistry')
        const fingerprint = await estateContract.getFingerprint(_estateId)

        await Bid.updateAssetByFingerprintChange(
          contractAddresses.EstateRegistry,
          _estateId,
          fingerprint,
          blockTime
        )
      }
      break
    }
    default:
      break
  }
}
