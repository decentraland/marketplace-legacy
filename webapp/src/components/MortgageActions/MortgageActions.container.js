import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { locations } from 'locations'
import {
  cancelMortgageRequest,
  claimMortgageResolutionRequest
} from 'modules/mortgage/actions'
import MortgageActions from './MortgageActions'

const mapState = () => ({})

const mapDispatch = (dispatch, { mortgage }) => ({
  onCancel: () =>
    dispatch(cancelMortgageRequest(mortgage.mortgage_id, mortgage.asset_id)),
  onPay: () => dispatch(push(locations.payMortgageParcel(mortgage.asset_id))),
  onClaim: () =>
    dispatch(
      claimMortgageResolutionRequest(mortgage.loan_id, mortgage.asset_id)
    )
})

export default connect(mapState, mapDispatch)(MortgageActions)
