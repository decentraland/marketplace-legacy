import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import BuyParcelByMortgagePage from './BuyParcelByMortgagePage'
import { createMortgageRequest } from 'modules/mortgage/actions'
import { locations } from 'locations'
import { getMatchParamsCoordinates } from 'modules/location/selectors'
import { isRequestingMortgageTransactionIdle } from 'modules/mortgage/selectors'
import { getPublicationByCoordinate } from 'modules/publication/selectors'
import { getWallet, isConnected, isConnecting } from 'modules/wallet/selectors'
import { getError as getMortgageError } from 'modules/mortgage/selectors'

const mapState = (state, ownProps) => {
  const { x, y } = getMatchParamsCoordinates(ownProps)

  return {
    x,
    y,
    publication: getPublicationByCoordinate(state, x, y),
    isTxIdle: isRequestingMortgageTransactionIdle(state),
    wallet: getWallet(state),
    isConnected: isConnected(state),
    isLoading: isConnecting(state),
    error: getMortgageError(state)
  }
}

const mapDispatch = (dispatch, ownProps) => {
  const { x, y } = getMatchParamsCoordinates(ownProps)

  return {
    onConfirm: params => dispatch(createMortgageRequest(params)),
    onCancel: () => dispatch(push(locations.parcelDetail(x, y)))
  }
}

export default withRouter(
  connect(mapState, mapDispatch)(BuyParcelByMortgagePage)
)
