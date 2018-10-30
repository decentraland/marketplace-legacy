import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import { locations } from 'locations'
import { navigateTo } from '@dapps/modules/location/actions'
import { buildCoordinate } from 'shared/coordinates'
import AssetDetailPage from './AssetDetailPage'

const mapState = (state, { match }) => {
  const id = match.params.id || buildCoordinate(match.params.x, match.params.y)
  return {
    id
  }
}

const mapDispatch = dispatch => ({
  onAssetClick: asset => dispatch(navigateTo(locations.assetDetail(asset)))
})

export default withRouter(connect(mapState, mapDispatch)(AssetDetailPage))
