import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import { PUBLICATION_STATUS } from 'shared/publication'
import { locations } from 'locations'
import { getMatchParams } from 'modules/location/selectors'
import { navigateTo } from 'modules/location/actions'
import { fetchParcelPublicationsRequest } from 'modules/publication/actions'
import { fetchActiveParcelMortgagesRequest } from 'modules/mortgage/actions'
import { getParcelMortgageFactory } from 'modules/mortgage/selectors'
import { getPublications } from 'modules/publication/selectors'
import { getDistricts } from 'modules/districts/selectors'

import ParcelDetailPage from './ParcelDetailPage'

const mapState = (state, ownProps) => {
  // Instanciate selectors
  const { x, y } = getMatchParams(ownProps)
  const getParcelMortgage = getParcelMortgageFactory(x, y)
  // Return mapStateToProps function
  return (state, ownProps) => {
    const { x, y } = getMatchParams(ownProps)
    return {
      x,
      y,
      publications: getPublications(state),
      districts: getDistricts(state),
      mortgage: getParcelMortgage(state)
    }
  }
}

const mapDispatch = dispatch => ({
  onFetchParcelPublications: (x, y) =>
    dispatch(fetchParcelPublicationsRequest(x, y, PUBLICATION_STATUS.open)),
  onFetchActiveParcelMortgages: (x, y) =>
    dispatch(fetchActiveParcelMortgagesRequest(x, y)),
  onBuy: ({ x, y }) => dispatch(navigateTo(locations.buyLand(x, y))),
  onAssetClick: asset => dispatch(navigateTo(locations.assetDetail(asset)))
})

export default withRouter(connect(mapState, mapDispatch)(ParcelDetailPage))
