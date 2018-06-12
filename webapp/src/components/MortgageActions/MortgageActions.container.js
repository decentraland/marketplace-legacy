import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import MortgageActions from './MortgageActions'
import {
  cancelMortgageRequest,
  claimMortgageResolutionRequest
} from 'modules/mortgage/actions'
import { locations } from 'locations'
import { splitCoordinate } from 'shared/parcel'

const mapState = (state, ownProps) => {
  const { mortgage } = ownProps
  return {
    mortgage
  }
}

const mapDispatch = (dispatch, { mortgage }) => {
  const [x, y] = splitCoordinate(mortgage.asset_id)
  return {
    onCancel: () =>
      dispatch(cancelMortgageRequest(mortgage.mortgage_id, mortgage.asset_id)),
    onPay: () => dispatch(push(locations.payMortgage(x, y))),
    onClaim: () =>
      dispatch(
        claimMortgageResolutionRequest(mortgage.loan_id, mortgage.asset_id)
      )
  }
}

export default connect(mapState, mapDispatch)(MortgageActions)
