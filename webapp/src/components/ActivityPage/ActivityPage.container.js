import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import {
  getPendingTransactions,
  getTransactionHistory
} from 'modules/transaction/selectors'
import {
  getNetwork,
  getAddress,
  isConnecting,
  isConnected
} from 'modules/wallet/selectors'
import { clearTransactionsRequest } from 'modules/transaction/actions'

import ActivityPage from './ActivityPage'

const mapState = state => {
  const address = getAddress(state)

  const pendingTransactions = getPendingTransactions(state, address).reverse()
  const transactionHistory = getTransactionHistory(state, address).reverse()

  const totalSent = pendingTransactions.length + transactionHistory.length

  return {
    address,
    pendingTransactions,
    transactionHistory,
    network: getNetwork(state),
    isEmpty: totalSent <= 0,
    isLoading: isConnecting(state),
    isConnected: isConnected(state)
  }
}

const mapDispatch = dispatch => ({
  onClear: address => dispatch(clearTransactionsRequest(address))
})

export default withRouter(connect(mapState, mapDispatch)(ActivityPage))
