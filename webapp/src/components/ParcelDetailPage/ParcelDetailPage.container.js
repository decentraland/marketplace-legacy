import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { locations } from 'locations'

import { getParams } from 'modules/location/selectors'
import { navigateTo } from 'modules/location/actions'
import { getError, isLoading } from 'modules/parcels/selectors'
import { getDistricts } from 'modules/districts/selectors'
import { getPublications as getParcelPublications } from 'modules/publication/selectors'
import { fetchParcelPublicationsRequest } from 'modules/publication/actions'
import ParcelDetailPage from './ParcelDetailPage'

const mapState = (state, ownProps) => {
  const { x, y } = getParams(ownProps)
  return {
    x,
    y,
    isLoading: isLoading(state),
    error: getError(state),
    districts: getDistricts(state),
    publications: getParcelPublications(state)
  }
}

const mapDispatch = dispatch => ({
  onFetchParcelPublications: (x, y) =>
    dispatch(fetchParcelPublicationsRequest(x, y)),
  onError: error => dispatch(navigateTo(locations.root)),
  onBuy: parcel => dispatch(navigateTo(locations.buyLand(parcel.x, parcel.y)))
})

export default withRouter(connect(mapState, mapDispatch)(ParcelDetailPage))
