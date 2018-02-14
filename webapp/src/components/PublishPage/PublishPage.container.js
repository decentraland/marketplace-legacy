import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import { getParams } from 'modules/location/selectors'
import { getWallet } from 'modules/wallet/selectors'
import { connectWalletRequest } from 'modules/wallet/actions'
import { publishRequest } from 'modules/publication/actions'

import PublishPage from './PublishPage'

const mapState = (state, ownProps) => {
  const { x, y } = getParams(ownProps)

  return {
    wallet: getWallet(state),
    x,
    y
  }
}

const mapDispatch = dispatch => ({
  onConnect: () => dispatch(connectWalletRequest()),
  onPublish: data => dispatch(publishRequest(data))
})

export default withRouter(connect(mapState, mapDispatch)(PublishPage))
