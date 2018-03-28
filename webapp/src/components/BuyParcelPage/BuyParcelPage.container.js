import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { getParams } from 'modules/location/selectors'
import { getWallet, isConnected, isConnecting } from 'modules/wallet/selectors'
import { getPublications, getLoading } from 'modules/publication/selectors'
import { findPublicationByCoordinates } from 'modules/publication/utils'
import { BUY_REQUEST, buyRequest } from 'modules/publication/actions'
import { isLoadingType } from 'modules/loading/selectors'
import { locations } from 'locations'

import BuyParcelPage from './BuyParcelPage'

const mapState = (state, ownProps) => {
  const params = getParams(ownProps)
  const x = parseInt(params.x, 10)
  const y = parseInt(params.y, 10)
  const publications = getPublications(state)

  return {
    x,
    y,
    publication: findPublicationByCoordinates(publications, x, y),
    isDisabled: isLoadingType(getLoading(state), BUY_REQUEST),
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
    onConfirm: publication => dispatch(buyRequest(publication)),
    onCancel: () => dispatch(push(locations.parcelDetail(x, y)))
  }
}

export default withRouter(connect(mapState, mapDispatch)(BuyParcelPage))
