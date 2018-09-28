import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { locations } from 'locations'
import { isLoadingType } from '@dapps/modules/loading/selectors'
import { getMatchParamsCoordinates } from 'modules/location/selectors'
import { getWallet, isConnected, isConnecting } from 'modules/wallet/selectors'
import {
  getData as getAuthorizations,
  isLoading
} from 'modules/authorization/selectors'
import {
  getPublicationByCoordinate,
  getLoading
} from 'modules/publication/selectors'
import { isBuyIdle } from 'modules/publication/selectors'
import { BUY_REQUEST, buyRequest } from 'modules/publication/actions'

import BuyParcelPage from './BuyParcelPage'

const mapState = (state, ownProps) => {
  const { x, y } = getMatchParamsCoordinates(ownProps)
  const wallet = getWallet(state)

  let authorization

  if (wallet) {
    authorization = getAuthorizations(state)[wallet.address]
  }

  return {
    x,
    y,
    wallet,
    authorization,
    publication: getPublicationByCoordinate(state, x, y),
    isDisabled: isLoadingType(getLoading(state), BUY_REQUEST),
    isTxIdle: isBuyIdle(state),
    isConnected: isConnected(state),
    isLoading: isConnecting(state) || isLoading(state)
  }
}

const mapDispatch = (dispatch, ownProps) => {
  const { x, y } = getMatchParamsCoordinates(ownProps)

  return {
    onConfirm: publication => dispatch(buyRequest(publication)),
    onCancel: () => dispatch(push(locations.parcelDetail(x, y)))
  }
}

export default withRouter(connect(mapState, mapDispatch)(BuyParcelPage))
