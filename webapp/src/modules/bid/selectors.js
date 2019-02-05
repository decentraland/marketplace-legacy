import { createSelector } from 'reselect'
import { getAddress } from '@dapps/modules/wallet/selectors'
import { isLoadingType } from '@dapps/modules/loading/selectors'

import { BID_REQUEST, CANCEL_BID_REQUEST } from './actions'
import { LISTING_STATUS } from 'shared/listing'
import { isOpen } from 'shared/listing'
import { isAssetBid } from 'shared/bid'

export const getState = state => state.bid
export const getData = state => getState(state).data
export const isLoading = state => getState(state).loading.length > 0
export const getLoading = state => getState(state).loading
export const getError = state => getState(state).error

export const isBidIdle = state => isLoadingType(getLoading(state), BID_REQUEST)
export const isCancelIdle = state =>
  isLoadingType(getLoading(state), CANCEL_BID_REQUEST)

export const getOpenBids = createSelector(getData, allBids =>
  Object.keys(allBids).reduce((bids, bidId) => {
    const bid = allBids[bidId]
    if (isOpen(bid)) {
      return { ...bids, [bidId]: bid }
    }
    return bids
  }, {})
)

export const getBidByAssetIdFactory = (assetType, assetId) =>
  createSelector(getAddress, getData, (userAddress, bids) =>
    Object.values(bids).find(
      bid => isAssetBid(bid, assetType, assetId) && bid.bidder === userAddress
    )
  )

export const getBidsByAssetFactory = (isOwner, assetType, assetId) =>
  createSelector(getAddress, getData, (userAddress, allBids) =>
    Object.keys(allBids).reduce((bids, bidId) => {
      const bid = allBids[bidId]
      const isBidderOrSeller =
        (isOwner && bid.seller === userAddress) ||
        (!isOwner && bid.bidder === userAddress)

      if (
        isAssetBid(bid, assetType, assetId) &&
        bid.status === LISTING_STATUS.open &&
        isBidderOrSeller
      ) {
        return [...bids, bid]
      }
      return bids
    }, [])
  )

export const getAcceptedBidsByAssetFactory = asset =>
  createSelector(getData, allBids =>
    Object.keys(allBids).reduce((bids, bidId) => {
      const bid = allBids[bidId]
      if (
        isAssetBid(bid, asset.type, asset.id) &&
        bid.status === LISTING_STATUS.sold
      ) {
        return [...bids, bid]
      }
      return bids
    }, [])
  )
