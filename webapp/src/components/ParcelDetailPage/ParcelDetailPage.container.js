import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import { locations } from 'locations'
import { getMatchParams } from 'modules/location/selectors'
import { navigateTo } from 'modules/location/actions'
import { getParcelMortgageFactory } from 'modules/mortgage/selectors'
import { getData as getPublications } from 'modules/publication/selectors'
import { getDistricts } from 'modules/districts/selectors'
import { getEstates } from 'modules/estates/selectors'

import ParcelDetailPage from './ParcelDetailPage'

const mapState = (state, ownProps) => {
  const { x, y } = getMatchParams(ownProps)
  const getParcelMortgage = getParcelMortgageFactory(x, y)
  return {
    x,
    y,
    publications: getPublications(state),
    districts: getDistricts(state),
    mortgage: getParcelMortgage(state),
    estates: getEstates(state)
  }
}

const mapDispatch = dispatch => ({
  onBuy: ({ x, y }) => dispatch(navigateTo(locations.buyParcel(x, y))),
  onAssetClick: asset => dispatch(navigateTo(locations.assetDetail(asset)))
})

export default withRouter(connect(mapState, mapDispatch)(ParcelDetailPage))
