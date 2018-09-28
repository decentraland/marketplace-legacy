import { connect } from 'react-redux'

import { isPending as isTransactionPending } from '@dapps/modules/transaction/utils'
import { getWallet, isConnecting, isConnected } from 'modules/wallet/selectors'
import {
  getData as getAuthorizations,
  isLoading,
  getAllowTransactions,
  getApproveTransactions
} from 'modules/authorization/selectors'
import {
  allowTokenRequest,
  approveTokenRequest
} from 'modules/authorization/actions'
import { updateDerivationPath } from 'modules/wallet/actions'
import SettingsPage from './SettingsPage'

const mapState = state => {
  const wallet = getWallet(state)

  let authorization
  let pendingAllowTransactions = []
  let pendingApproveTransactions = []

  if (wallet) {
    authorization = getAuthorizations(state)[wallet.address]
    pendingAllowTransactions = getAllowTransactions(state).filter(transaction =>
      isTransactionPending(transaction.status)
    )
    pendingApproveTransactions = getApproveTransactions(state).filter(
      transaction => isTransactionPending(transaction.status)
    )
  }

  return {
    wallet,
    authorization,
    pendingAllowTransactions,
    pendingApproveTransactions,
    isLoading: isConnecting(state) || isLoading(state),
    isConnected: isConnected(state)
  }
}

const mapDispatch = dispatch => ({
  onUpdateDerivationPath: derivationPath =>
    dispatch(updateDerivationPath(derivationPath)),
  onAllowToken: (amount, contractName, tokenContractName) =>
    dispatch(allowTokenRequest(amount, contractName, tokenContractName)),
  onApproveToken: (isApproved, contractName, tokenContractName) =>
    dispatch(approveTokenRequest(isApproved, contractName, tokenContractName))
})

export default connect(mapState, mapDispatch)(SettingsPage)
