import { connect } from 'react-redux'
import { connectWalletRequest } from '@dapps/modules/wallet/actions'

import SignInNotice from './SignInNotice'

const mapState = () => ({})

const mapDispatch = dispatch => ({
  onConnect: () => dispatch(connectWalletRequest())
})

export default connect(mapState, mapDispatch)(SignInNotice)
