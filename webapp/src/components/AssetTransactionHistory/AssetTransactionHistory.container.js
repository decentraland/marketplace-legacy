import { connect } from 'react-redux'

import { fetchAssetListingHistory } from 'modules/asset//actions'
import { getAcceptedBidsByAsset } from 'modules/bid/selectors'
import AssetTransactionHistory from './AssetTransactionHistory'

const mapState = (state, { asset, assetType }) => {
  return {
    bids: getAcceptedBidsByAsset(state, asset, assetType)
  }
}

const mapDispatch = (dispatch, { asset, assetType }) => ({
  onFetchAssetTransactionHistory: () =>
    dispatch(fetchAssetListingHistory(asset, assetType))
})

export default connect(mapState, mapDispatch)(AssetTransactionHistory)
