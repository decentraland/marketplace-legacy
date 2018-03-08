import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import {
  getPendingTransactions,
  getTransactionHistory
} from 'modules/transaction/selectors'
import { isConnecting, isConnected } from 'modules/wallet/selectors'

import ActivityPage from './ActivityPage'

const mapState = state => {
  const pendingTransactions = getPendingTransactions(state).reverse()
  const transactionHistory = getTransactionHistory(state).reverse()
  const totalSent = pendingTransactions.length + transactionHistory.length

  return {
    pendingTransactions,
    transactionHistory,
    isEmpty: totalSent <= 0,
    isLoading: isConnecting(state),
    isConnected: isConnected(state)
  }
}

const mapDispatch = dispatch => ({})

export default withRouter(connect(mapState, mapDispatch)(ActivityPage))
