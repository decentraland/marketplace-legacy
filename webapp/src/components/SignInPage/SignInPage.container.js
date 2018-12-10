import { connect } from 'react-redux'
import { connectWalletRequest } from '@dapps/modules/wallet/actions'
import { navigateTo } from '@dapps/modules/location/actions'

import { isConnecting, isConnected } from 'modules/wallet/selectors'
import SignInPage from './SignInPage'

const mapState = state => ({
  isLoading: isConnecting(state),
  isConnected: isConnected(state)
})

const mapDispatch = dispatch => ({
  onConnect: () => dispatch(connectWalletRequest()),
  onNavigate: url => dispatch(navigateTo(url))
})

export default connect(mapState, mapDispatch)(SignInPage)
