import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { locations } from 'locations'

import { getParams } from 'modules/location/selectors'
import { navigateTo } from 'modules/location/actions'
import { getError } from 'modules/parcels/selectors'
import { getDistricts } from 'modules/districts/selectors'
import { getPublications } from 'modules/publication/selectors'
import ParcelDetailPage from './ParcelDetailPage'

const mapState = (state, ownProps) => {
  const { x, y } = getParams(ownProps)
  return {
    x,
    y,
    districts: getDistricts(state),
    publications: getPublications(state),
    error: getError(state)
  }
}

const mapDispatch = dispatch => ({
  onError: error => dispatch(navigateTo(locations.root)),
  onBuy: parcel => dispatch(navigateTo(locations.buyLand(parcel.x, parcel.y)))
})

export default withRouter(connect(mapState, mapDispatch)(ParcelDetailPage))
