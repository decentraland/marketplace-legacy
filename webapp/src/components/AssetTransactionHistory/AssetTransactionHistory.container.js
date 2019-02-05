import { connect } from 'react-redux'

import { fetchAssetListingHistory } from 'modules/asset//actions'
import { getAcceptedBidsByAssetFactory } from 'modules/bid/selectors'
import AssetTransactionHistory from './AssetTransactionHistory'

const mapState = (state, ownProps) => {
  const getBids = getAcceptedBidsByAssetFactory(ownProps.asset)
  return {
    bids: getBids(state)
  }
}

const mapDispatch = (dispatch, ownProps) => ({
  onFetchAssetTransactionHistory: () =>
    dispatch(fetchAssetListingHistory(ownProps.asset))
})

export default connect(mapState, mapDispatch)(AssetTransactionHistory)
