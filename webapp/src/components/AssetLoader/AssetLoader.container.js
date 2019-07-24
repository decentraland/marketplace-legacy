import { connect } from 'react-redux'
import { navigateTo } from '@dapps/modules/location/actions'

import { locations } from 'locations'
import { fetchAssetRequest } from 'modules/asset/actions'
import { getAsset, isLoading } from 'modules/asset/selectors'
import AssetLoader from './AssetLoader'

const mapState = (state, { assetId, assetType }) => ({
  isLoading: isLoading(state, assetId, assetType),
  asset: getAsset(state, assetId, assetType)
})

const mapDispatch = (dispatch, { assetId, assetType }) => ({
  onFetchAsset: () => dispatch(fetchAssetRequest(assetId, assetType)),
  onAccessDenied: () =>
    dispatch(navigateTo(locations.assetDetail(assetId, assetType)))
})

export default connect(mapState, mapDispatch)(AssetLoader)
