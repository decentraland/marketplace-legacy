import { connect } from 'react-redux'
import MortgageActions from './MortgageActions'
import {
  cancelMortgageRequest,
  payMortgageRequest
} from 'modules/mortgage/actions'

const mapState = (state, ownProps) => {
  const { mortgage } = ownProps
  return {
    mortgage
  }
}

const mapDispatch = (dispatch, { mortgage }) => ({
  onCancel: () =>
    dispatch(cancelMortgageRequest(mortgage.mortgage_id, mortgage.asset_id)),
  onPay: () => dispatch(payMortgageRequest(mortgage.loan_id))
})

export default connect(mapState, mapDispatch)(MortgageActions)
