import { connect } from 'react-redux'

import { fetchAssetListingHistory } from 'modules/asset//actions'
import { getAcceptedBidsByAsset } from 'modules/bid/selectors'
import AssetTransactionHistory from './AssetTransactionHistory'

const mapState = (state, ownProps) => {
  return {
    bids: getAcceptedBidsByAsset(state, ownProps.asset)
  }
}

const mapDispatch = (dispatch, ownProps) => ({
  onFetchAssetTransactionHistory: () =>
    dispatch(fetchAssetListingHistory(ownProps.asset))
})

export default connect(mapState, mapDispatch)(AssetTransactionHistory)
