import { connect } from 'react-redux'
import { navigateTo } from '@dapps/modules/location/actions'

import { locations } from 'locations'
import { fetchAssetRequest } from 'modules/asset/actions'
import { getAsset, isLoading } from 'modules/asset/selectors'
import AssetLoader from './AssetLoader'

const mapState = (state, { id, assetType }) => ({
  isLoading: isLoading(state, id, assetType),
  asset: getAsset(state, id, assetType)
})

const mapDispatch = (dispatch, { id, assetType }) => ({
  onFetchAsset: () => dispatch(fetchAssetRequest(id, assetType)),
  onAccessDenied: () =>
    dispatch(navigateTo(locations.assetDetail(id, assetType)))
})

export default connect(mapState, mapDispatch)(AssetLoader)
