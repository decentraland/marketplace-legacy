import { connect } from 'react-redux'

import { fetchAssetListingHistory } from 'modules/asset//actions'
import { getAcceptedBidsByAsset } from 'modules/bid/selectors'
import AssetTransactionHistory from './AssetTransactionHistory'

const mapState = (state, { asset, assetType }) => {
  return {
    bids: getAcceptedBidsByAsset(state, asset, assetType)
  }
}

const mapDispatch = (dispatch, ownProps) => ({
  onFetchAssetTransactionHistory: () =>
    dispatch(fetchAssetListingHistory(ownProps.asset))
})

export default connect(mapState, mapDispatch)(AssetTransactionHistory)
