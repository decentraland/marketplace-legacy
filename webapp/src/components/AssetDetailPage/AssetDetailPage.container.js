import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import { fetchAsset } from 'modules/asset/actions'
import { buildCoordinate } from 'shared/coordinates'
import AssetDetailPage from './AssetDetailPage'

const mapState = (_, { match }) => {
  const id = match.params.id || buildCoordinate(match.params.x, match.params.y)
  return {
    id
  }
}

const mapDispatch = dispatch => ({
  onAssetClick: (asset, assetType) => {
    dispatch(fetchAsset(asset, assetType))
  }
})

export default withRouter(connect(mapState, mapDispatch)(AssetDetailPage))
