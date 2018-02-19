import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import { getParams } from 'modules/location/selectors'
import {
  getWallet,
  isLoading as isWalletLoading
} from 'modules/wallet/selectors'
import { isLoading as isAddressLoading } from 'modules/address/selectors'
import { getPublications } from 'modules/publication/selectors'
import { connectWalletRequest } from 'modules/wallet/actions'
import { publishRequest } from 'modules/publication/actions'
import { navigateTo } from 'modules/location/actions'

import { findPublicationByCoordinates } from 'modules/publication/utils'

import PublishPage from './PublishPage'

const mapState = (state, ownProps) => {
  const params = getParams(ownProps)
  const publications = getPublications(state)

  const x = parseInt(params.x, 10)
  const y = parseInt(params.y, 10)

  return {
    publication: findPublicationByCoordinates(publications, x, y),
    wallet: getWallet(state),
    isWalletLoading: isWalletLoading(state),
    isAddressLoading: isAddressLoading(state),
    x,
    y
  }
}

const mapDispatch = dispatch => ({
  onConnect: () => dispatch(connectWalletRequest()),
  onPublish: publication => dispatch(publishRequest(publication)),
  onNavigate: location => dispatch(navigateTo(location))
})

export default withRouter(connect(mapState, mapDispatch)(PublishPage))
