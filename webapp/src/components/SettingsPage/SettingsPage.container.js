import { connect } from 'react-redux'

import { getWallet, isConnecting, isConnected } from 'modules/wallet/selectors'
import {
  updateDerivationPath,
  approveTokenRequest,
  authorizeTokenRequest
} from 'modules/wallet/actions'
import SettingsPage from './SettingsPage'

const mapState = state => {
  return {
    wallet: getWallet(state),
    isLoading: isConnecting(state),
    isConnected: isConnected(state)
  }
}

const mapDispatch = dispatch => ({
  onUpdateDerivationPath: derivationPath =>
    dispatch(updateDerivationPath(derivationPath)),
  onApproveToken: (amount, contractName, tokenContractName) =>
    dispatch(approveTokenRequest(amount, contractName, tokenContractName)),
  onAuthorizeToken: (isAuthorized, contractName, tokenContractName) =>
    dispatch(
      authorizeTokenRequest(isAuthorized, contractName, tokenContractName)
    )
})

export default connect(mapState, mapDispatch)(SettingsPage)
