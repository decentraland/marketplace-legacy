import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { locations } from 'locations'
import { getMatchParams } from 'modules/location/selectors'
import { getWallet, isConnected, isConnecting } from 'modules/wallet/selectors'
import { isLoading, getAuthorizations } from 'modules/authorization/selectors'
import { getEstatePublicationById } from 'modules/publication/selectors'
import { isBuyIdle } from 'modules/publication/selectors'
import { buyRequest } from 'modules/publication/actions'

import BuyEstatePage from './BuyEstatePage'

const mapState = (state, ownProps) => {
  const { id } = getMatchParams(ownProps)
  const wallet = getWallet(state)

  let authorization

  if (wallet) {
    authorization = getAuthorizations(state)
  }

  return {
    id,
    wallet,
    authorization,
    publication: getEstatePublicationById(state, id),
    isTxIdle: isBuyIdle(state),
    isConnected: isConnected(state),
    isLoading: isConnecting(state) || isLoading(state)
  }
}

const mapDispatch = (dispatch, ownProps) => {
  const { id } = getMatchParams(ownProps)

  return {
    onConfirm: publication => dispatch(buyRequest(publication)),
    onCancel: () => dispatch(push(locations.estateDetail(id)))
  }
}

export default withRouter(connect(mapState, mapDispatch)(BuyEstatePage))
