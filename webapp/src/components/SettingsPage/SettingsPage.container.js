import { connect } from 'react-redux'

import { getWallet, isConnecting, isConnected } from 'modules/wallet/selectors'
import {
  getData as getAuthorizations,
  isLoading
  // getAllowTransactions,
  // getApproveTransactions
} from 'modules/authorization/selectors'
import {
  allowTokenRequest,
  approveTokenRequest
} from 'modules/authorization/actions'
import { updateDerivationPath } from 'modules/wallet/actions'
import SettingsPage from './SettingsPage'

const mapState = state => {
  const wallet = getWallet(state)
  let authorizations = getAuthorizations(state)

  if (wallet) {
    authorizations = getAuthorizations(state)[wallet.address]
  }

  return {
    wallet,
    authorizations,
    isLoading: isConnecting(state) || isLoading(state),
    isConnected: isConnected(state)
  }
}

const mapDispatch = dispatch => ({
  onUpdateDerivationPath: derivationPath =>
    dispatch(updateDerivationPath(derivationPath)),
  onAllowToken: (isAuthorized, contractName, tokenContractName) =>
    dispatch(allowTokenRequest(isAuthorized, contractName, tokenContractName)),
  onApproveToken: (amount, contractName, tokenContractName) =>
    dispatch(approveTokenRequest(amount, contractName, tokenContractName))
})

export default connect(mapState, mapDispatch)(SettingsPage)
