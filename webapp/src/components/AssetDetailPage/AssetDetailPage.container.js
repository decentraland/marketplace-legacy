import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import { getCenterCoords } from 'shared/asset'
import { locations } from 'locations'
import { navigateTo } from 'modules/location/actions'
import { getError, isLoading } from 'modules/parcels/selectors'

import AssetDetailPage from './AssetDetailPage'

const mapState = (state, { asset }) => {
  const { x, y } = getCenterCoords(asset)
  return {
    x,
    y,
    isLoading: isLoading(state),
    error: getError(state)
  }
}

const mapDispatch = dispatch => ({
  onError: () => dispatch(navigateTo(locations.root()))
})

export default withRouter(connect(mapState, mapDispatch)(AssetDetailPage))
