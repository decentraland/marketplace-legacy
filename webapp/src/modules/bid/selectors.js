import { createSelector } from 'reselect'
import { getAddress } from '@dapps/modules/wallet/selectors'
import { isLoadingType } from '@dapps/modules/loading/selectors'

import {
  BID_REQUEST,
  CANCEL_BID_REQUEST,
  ACCEPT_BID_REQUEST,
  FETCH_ASSET_BID_REQUEST,
  FETCH_BID_REQUEST
} from './actions'
import { LISTING_STATUS } from 'shared/listing'
import { isAssetBid, isActive } from 'shared/bid'

export const getState = state => state.bid
export const getData = state => getState(state).data
export const isLoading = state => getState(state).loading.length > 0
export const getLoading = state => getState(state).loading
export const getError = state => getState(state).error

export const isFetchingBids = state =>
  isLoadingType(getLoading(state), FETCH_ASSET_BID_REQUEST) ||
  isLoadingType(getLoading(state), FETCH_BID_REQUEST)
export const isBidIdle = state => isLoadingType(getLoading(state), BID_REQUEST)
export const isCancelIdle = state =>
  isLoadingType(getLoading(state), CANCEL_BID_REQUEST)
export const isAcceptIdle = state =>
  isLoadingType(getLoading(state), ACCEPT_BID_REQUEST)

export const getActiveBids = createSelector(getData, allBids =>
  Object.keys(allBids).reduce((bids, bidId) => {
    const bid = allBids[bidId]
    if (isActive(bid)) {
      return { ...bids, [bidId]: bid }
    }
    return bids
  }, {})
)

export const getBidByAssetIdFactory = (assetId, assetType) =>
  createSelector(getAddress, getData, (userAddress, bids) =>
    Object.values(bids).find(
      bid => isAssetBid(bid, assetId, assetType) && bid.bidder === userAddress
    )
  )

export const getWalletBidsByAsset = (state, asset, assetType) => {
  const allBids = getData(state)
  const walletAddress = getAddress(state)

  const isOwner = asset.owner === walletAddress

  return Object.values(allBids).reduce((bids, bid) => {
    const isBidderOrSeller =
      (isOwner && bid.seller === walletAddress) ||
      (!isOwner && bid.bidder === walletAddress)

    if (
      isAssetBid(bid, asset.id, assetType) &&
      bid.status === LISTING_STATUS.open &&
      isBidderOrSeller
    ) {
      return [...bids, bid]
    }
    return bids
  }, [])
}

export const getAcceptedBidsByAsset = (state, asset) => {
  const allBids = getData(state)

  return Object.keys(allBids).reduce((bids, bidId) => {
    const bid = allBids[bidId]
    if (
      isAssetBid(bid, asset.id, asset.type) &&
      bid.status === LISTING_STATUS.sold
    ) {
      return [...bids, bid]
    }
    return bids
  }, [])
}
