import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { locations } from 'locations'
import {
  payMortgageRequest,
  fetchActiveParcelMortgagesRequest
} from 'modules/mortgage/actions'
import { getMatchParamsCoordinates } from 'modules/location/selectors'
import {
  getParcelMortgageFactory,
  isFetchingParcelMortgages,
  isPayingMortgageTransactionIdle
} from 'modules/mortgage/selectors'
import { isLoading } from 'modules/parcels/selectors'
import { getWallet, isConnected, isConnecting } from 'modules/wallet/selectors'
import PayMortgagePage from './PayMortgagePage'

const mapState = (state, ownProps) => {
  const { x, y } = getMatchParamsCoordinates(ownProps)
  const getMortgage = getParcelMortgageFactory(x, y)

  return state => ({
    x,
    y,
    wallet: getWallet(state),
    isConnected: isConnected(state),
    isConnecting: isConnecting(state),
    isFetchingMortgages: isFetchingParcelMortgages(state),
    isLoading: isLoading(state),
    mortgage: getMortgage(state),
    isTxIdle: isPayingMortgageTransactionIdle(state)
  })
}

const mapDispatch = (dispatch, ownProps) => {
  const { x, y } = getMatchParamsCoordinates(ownProps)

  return {
    onFetchMortgage: () => dispatch(fetchActiveParcelMortgagesRequest(x, y)),
    onSubmit: mortgage => dispatch(payMortgageRequest(mortgage)),
    onCancel: () => dispatch(push(locations.parcelDetail(x, y)))
  }
}

export default withRouter(connect(mapState, mapDispatch)(PayMortgagePage))
