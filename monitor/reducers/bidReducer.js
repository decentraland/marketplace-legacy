import { Log } from 'decentraland-commons'
import { eth } from 'decentraland-eth'

import { getAssetTypeFromEvent, getAssetIdFromEvent } from './utils'
import { BlockTimestampService } from '../../src/BlockTimestamp'
import { contractAddresses, eventNames } from '../../src/ethereum'
import { isDuplicatedConstraintError } from '../../src/database'
import { Asset } from '../../src/Asset'
import { Bid } from '../../src/Listing'
import { LISTING_STATUS } from '../../shared/listing'

const log = new Log('bidReducer')

export async function bidReducer(event) {
  const { address } = event

  switch (address) {
    case contractAddresses.EstateRegistry:
    case contractAddresses.LANDRegistry:
    case contractAddresses.ERC721Bid: {
      await reduceBid(event)
      break
    }
    default:
      break
  }
}

async function reduceBid(event) {
  const { address, name, block_number } = event
  const assetType = getAssetTypeFromEvent(event)
  const [assetId, blockTime] = await Promise.all([
    getAssetIdFromEvent(event),
    new BlockTimestampService().getBlockTime(block_number)
  ])

  if (contractAddresses.ERC721Bid === address && !assetId) {
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
        status: LISTING_STATUS.open // @nacho TODO: change it to also delete when fingerprint changed
      })

      const asset = await Asset.getNew(assetType).findById(assetId)

      try {
        await Bid.insert({
          id: _id,
          token_address: _tokenAddress,
          token_id: _tokenId,
          bidder: _bidder,
          price: eth.utils.fromWei(_price),
          expires_at: _expiresAt * 1000,
          fingerprint: _fingerprint,
          asset_type: assetType,
          asset_id: assetId,
          block_time_created_at: blockTime,
          status: LISTING_STATUS.open,
          seller: asset.owner.toLowerCase(),
          block_number
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
          block_time_updated_at: blockTime,
          block_number
        },
        { id: _id }
      )

      await Bid.invalidateBids(_tokenAddress, _tokenId, blockTime, block_number)
      break
    }
    case eventNames.BidCancelled: {
      const id = event.args._id

      log.info(`[${name}] Bid ${id} cancelled`)

      await Bid.update(
        {
          status: LISTING_STATUS.cancelled,
          block_time_updated_at: blockTime,
          block_number
        },
        { id }
      )
      break
    }
    case eventNames.RemoveLand:
    case eventNames.AddLand: {
      const bids = await Bid.getWithStatuses(address, assetId, [
        LISTING_STATUS.open,
        LISTING_STATUS.fingerprintChanged
      ])

      const estateHasActiveBids = bids.length > 0

      if (estateHasActiveBids) {
        log.info(
          `[${name}] Updating bids for the Estate ${assetId}, fingerprint changed`
        )

        const estateContract = eth.getContract('EstateRegistry')
        const fingerprint = await estateContract.getFingerprint(assetId)

        await Bid.updateAssetByFingerprintChange(
          contractAddresses.EstateRegistry,
          assetId,
          fingerprint,
          blockTime,
          block_number
        )
      }
      break
    }
    case eventNames.Transfer: {
      const to = event.args.to || event.args._to
      // The assetId is the id of the asset based on the address of the token we get from Marketplace or Bid contracts events.
      // If no token address was extracted from the event, it will default on LANDRegistry
      // As we need to handle Estates and LANDs Transfer events, we should get the assetId checking
      // first if the _tokenId is set (Estate) or assetId which is the asset_id for the LAND
      const asset_id = event.args._tokenId || assetId

      // Skip update for the OnERC721Received
      if (contractAddresses.ERC721Bid === to.toLowerCase()) {
        return
      }

      log.info(
        `[${name}] Updating seller for the asset with token address ${address} and id "${asset_id}" to "${to}"`
      )

      await Bid.updateAssetOwner(
        address,
        asset_id,
        to.toLowerCase(),
        blockTime,
        block_number
      )

      break
    }
    default:
      break
  }
}
