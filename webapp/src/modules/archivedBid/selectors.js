import { getWalletBidsByAsset } from 'modules/bid/selectors'

export const getState = state => state.archivedBid
export const getData = state => getState(state).data

export const getWalletUnarchivedBidsByAsset = (state, asset, asseyType) => {
  const bids = getWalletBidsByAsset(state, asset, asseyType)
  const archivedBids = getData(state)
  return bids.filter(bid => !archivedBids[bid.id])
}
