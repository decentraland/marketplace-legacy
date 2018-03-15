import { connect } from 'react-redux'
import { connectWalletRequest } from 'modules/wallet/actions'
import Wallet from './Wallet'

const mapState = state => ({})

const mapDispatch = dispatch => ({
  onConnect: () => dispatch(connectWalletRequest())
})

export default connect(mapState, mapDispatch)(Wallet)
