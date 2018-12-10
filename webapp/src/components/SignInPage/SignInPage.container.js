import { connect } from 'react-redux'
import { navigateTo } from '@dapps/modules/location/actions'

import { isConnecting, isConnected } from 'modules/wallet/selectors'
import SignInPage from './SignInPage'

const mapState = state => ({
  isLoading: isConnecting(state),
  isConnected: isConnected(state)
})

const mapDispatch = dispatch => ({
  onNavigate: url => dispatch(navigateTo(url))
})

export default connect(mapState, mapDispatch)(SignInPage)
