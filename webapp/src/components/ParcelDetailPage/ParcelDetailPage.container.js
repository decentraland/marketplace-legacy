import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { locations } from 'locations'

import { getParams } from 'modules/location/selectors'
import { navigateTo } from 'modules/location/actions'
import { getError, isLoading } from 'modules/parcels/selectors'
import { getDistricts } from 'modules/districts/selectors'
import { getPublications as getParcelPublications } from 'modules/publication/selectors'
import { fetchParcelPublicationsRequest } from 'modules/publication/actions'
import { PUBLICATION_STATUS } from 'modules/publication/utils'
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
    dispatch(fetchParcelPublicationsRequest(x, y, PUBLICATION_STATUS.open)),
  onError: error => dispatch(navigateTo(locations.root)),
  onBuy: parcel => dispatch(navigateTo(locations.buyLand(parcel.x, parcel.y))),
  onParcelClick: (x, y) => dispatch(navigateTo(locations.parcelDetail(x, y)))
})

export default withRouter(connect(mapState, mapDispatch)(ParcelDetailPage))
