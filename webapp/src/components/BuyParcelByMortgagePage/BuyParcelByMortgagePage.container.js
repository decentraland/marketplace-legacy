import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import BuyParcelByMortgagePage from './BuyParcelByMortgagePage'
import {
  createMortgageRequest,
  CREATE_MORTGAGE_REQUEST
} from 'modules/mortgage/actions'
import { locations } from 'locations'
import { getParams } from 'modules/location/selectors'
import { getPublications, getLoading } from 'modules/publication/selectors'
import { findPublicationByCoordinates } from 'modules/publication/utils'
import { getWallet, isConnected, isConnecting } from 'modules/wallet/selectors'
import { isLoadingType } from 'modules/loading/selectors'

const mapState = (state, ownProps) => {
  const params = getParams(ownProps)
  const x = parseInt(params.x, 10)
  const y = parseInt(params.y, 10)
  const publications = getPublications(state)

  return {
    x,
    y,
    publication: findPublicationByCoordinates(publications, x, y),
    isDisabled: isLoadingType(getLoading(state), CREATE_MORTGAGE_REQUEST),
    wallet: getWallet(state),
    isConnected: isConnected(state),
    isLoading: isConnecting(state)
  }
}

const mapDispatch = (dispatch, ownProps) => {
  const params = getParams(ownProps)
  const x = parseInt(params.x, 10)
  const y = parseInt(params.y, 10)

  return {
    onConfirm: params => dispatch(createMortgageRequest(params)),
    onCancel: () => dispatch(push(locations.parcelDetail(x, y)))
  }
}

export default withRouter(
  connect(mapState, mapDispatch)(BuyParcelByMortgagePage)
)
