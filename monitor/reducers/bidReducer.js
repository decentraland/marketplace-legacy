import { Log } from 'decentraland-commons'
import { eth } from 'decentraland-eth'

import { getAssetTypeFromEvent, getAssetIdFromEvent } from './utils'
import { BlockTimestampService } from '../../src/BlockTimestamp'
import { contractAddresses, eventNames } from '../../src/ethereum'
import { isDuplicatedConstraintError } from '../../src/database'
import { Asset } from '../../src/Asset'
import { Bid } from '../../src/Listing'
import { LISTING_STATUS } from '../../shared/listing'
import { isDistrict } from '../../shared/district'

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

  // To avoid EstateCreations
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

      await Bid.deleteBid(_tokenAddress, _tokenId, _bidder.toLowerCase(), [
        LISTING_STATUS.open,
        LISTING_STATUS.fingerprintChanged
      ])

      const asset = await Asset.getNew(assetType).findById(assetId)

      if (!asset) {
        return log.info(`[${name}] Asset with id: ${_tokenId} does not exist`)
      }

      if (isDistrict(asset)) {
        return log.info(
          `[${name}] Token with address: ${_tokenAddress} and id: ${_tokenId} is part of a district and won't be indexed`
        )
      }

      log.info(
        `[${name}] Creating bid ${_id} for token with address: ${_tokenAddress} and id: ${_tokenId}`
      )

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

      await Bid.cancelBids(blockTime, block_number, _tokenAddress, _tokenId)
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
      const tokenId = event.args._estateId
      const exists = await Bid.hasWithStatuses(address, tokenId, [
        LISTING_STATUS.open,
        LISTING_STATUS.fingerprintChanged
      ])

      if (exists) {
        log.info(
          `[${name}] Updating bids for the Estate ${tokenId}, fingerprint changed`
        )

        const estateContract = eth.getContract('EstateRegistry')
        const fingerprint = await estateContract.getFingerprint(tokenId)

        await Bid.updateBidsByAssetFingerprintChange(
          blockTime,
          block_number,
          address,
          tokenId,
          fingerprint
        )
      }
      break
    }
    case eventNames.Transfer: {
      const to = event.args.to || event.args._to
      const from = event.args.from || event.args._from
      // The assetId is the id of the asset based on the address of the token we get from
      // Marketplace or Bid contracts events. If no token address is extracted from the event,
      // it defaults on getParcelIdFromEvent returning 0,1 for the Estate with id 1.
      // To avoid that, we should get the assetId checking first if the _tokenId is set (Estate)
      const asset_id = event.args._tokenId || assetId

      // Skip update for the OnERC721Received
      if (
        contractAddresses.ERC721Bid === to.toLowerCase() ||
        contractAddresses.ERC721Bid === from.toLowerCase()
      ) {
        return
      }

      const exists = await Bid.count({ token_address: address, asset_id })
      if (exists) {
        log.info(
          `[${name}] Updating seller for the asset with token address ${address} and id "${asset_id}" to "${to}"`
        )

        await Bid.updateAssetOwner(
          to.toLowerCase(),
          blockTime,
          block_number,
          address,
          asset_id
        )
      }

      break
    }
    default:
      break
  }
}
