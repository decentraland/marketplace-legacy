import { connect } from 'react-redux'
import MortgageActions from './MortgageActions'
import { cancelMortgageRequest } from 'modules/mortgage/actions'

const mapState = (state, ownProps) => {
  const { mortgage } = ownProps
  return {
    mortgage
  }
}

const mapDispatch = (dispatch, { mortgage }) => ({
  onCancel: () =>
    dispatch(
      cancelMortgageRequest(mortgage.mortgage_id, {
        x: mortgage.x,
        y: mortgage.y
      })
    )
})

export default connect(mapState, mapDispatch)(MortgageActions)
