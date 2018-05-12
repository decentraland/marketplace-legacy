import { connect } from 'react-redux'
import MortgageActions from './MortgageActions'
import { cancelMortgageRequest } from 'modules/mortgage/actions'

const mapState = (state, ownProps) => {
  const { mortgage } = ownProps
  return {
    mortgage
  }
}

const mapDispatch = (dispatch, ownProps) => ({
  onCancel: () => dispatch(cancelMortgageRequest(ownProps.mortgage.mortgage_id))
})

export default connect(mapState, mapDispatch)(MortgageActions)
