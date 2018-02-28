import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import { getParams } from 'modules/location/selectors'
import { navigateTo } from 'modules/location/actions'
import { getError } from 'modules/parcels/selectors'
import { getDistricts } from 'modules/districts/selectors'
import ParcelDetailPage from './ParcelDetailPage'

const mapState = (state, ownProps) => {
  const { x, y } = getParams(ownProps)
  return {
    x,
    y,
    districts: getDistricts(state),
    error: getError(state)
  }
}

const mapDispatch = dispatch => ({
  onNavigate: location => dispatch(navigateTo(location))
})

export default withRouter(connect(mapState, mapDispatch)(ParcelDetailPage))
