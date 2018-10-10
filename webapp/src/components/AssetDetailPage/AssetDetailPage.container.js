import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import { locations } from 'locations'
import { navigateTo } from 'modules/location/actions'
import AssetDetailPage from './AssetDetailPage'
import { buildCoordinate } from 'shared/parcel'

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
