import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import { navigateToAsset } from 'modules/asset/actions'
import { buildCoordinate } from 'shared/coordinates'
import AssetDetailPage from './AssetDetailPage'

const mapState = (_, { match }) => {
  const id = match.params.id || buildCoordinate(match.params.x, match.params.y)
  return {
    id
  }
}

const mapDispatch = dispatch => ({
  onAssetClick: (assetId, assetType) => {
    dispatch(navigateToAsset(assetId, assetType))
  }
})

export default withRouter(connect(mapState, mapDispatch)(AssetDetailPage))
