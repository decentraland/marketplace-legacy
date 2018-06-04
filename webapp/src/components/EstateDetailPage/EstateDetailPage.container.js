import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import { locations } from 'locations'
import { getMatchParams } from 'modules/location/selectors'
import { navigateTo } from 'modules/location/actions'
import { getError, isLoading } from 'modules/parcels/selectors'
import { getDistricts } from 'modules/districts/selectors'
import { getPublications as getParcelPublications } from 'modules/publication/selectors'
import EstateDetailPage from './EstateDetailPage'
import { getAssetLocation } from 'lib/utils'

const mapState = (state, ownProps) => {
  const { id } = getMatchParams(ownProps)
  return {
    id,
    isLoading: isLoading(state),
    error: getError(state),
    districts: getDistricts(state),
    publications: getParcelPublications(state)
  }
}

const mapDispatch = dispatch => ({
  onError: () => dispatch(navigateTo(locations.root)),
  onAssetClick: asset => dispatch(navigateTo(getAssetLocation(asset)))
})

export default withRouter(connect(mapState, mapDispatch)(EstateDetailPage))
