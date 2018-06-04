import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import MortgageActions from './MortgageActions'
import { cancelMortgageRequest } from 'modules/mortgage/actions'
import { locations } from 'locations'
import { splitCoordinate } from 'lib/utils'

const mapState = (state, ownProps) => {
  const { mortgage } = ownProps
  return {
    mortgage
  }
}

const mapDispatch = (dispatch, { mortgage }) => {
  const coordinates = splitCoordinate(mortgage.asset_id)
  return {
    onCancel: () =>
      dispatch(cancelMortgageRequest(mortgage.mortgage_id, mortgage.asset_id)),
    onPay: () =>
      dispatch(push(locations.payMortgage(coordinates[0], coordinates[1])))
  }
}

export default connect(mapState, mapDispatch)(MortgageActions)
