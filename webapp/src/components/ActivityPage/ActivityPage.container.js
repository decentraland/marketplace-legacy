import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import {
  getPendingTransactions,
  getTransactionHistory
} from 'modules/transaction/selectors'
import { getWallet, isLoading } from 'modules/wallet/selectors'
import { connectWalletRequest } from 'modules/wallet/actions'

import ActivityPage from './ActivityPage'

const mapState = state => {
  const pendingTransactions = getPendingTransactions(state).reverse()
  const transactionHistory = getTransactionHistory(state).reverse()
  const totalSent = pendingTransactions.length + transactionHistory.length

  return {
    pendingTransactions,
    transactionHistory,
    isEmpty: totalSent <= 0,
    isLoading: isLoading(state) || !getWallet(state).address
  }
}

const mapDispatch = dispatch => ({
  onConnect: () => dispatch(connectWalletRequest())
})

export default withRouter(connect(mapState, mapDispatch)(ActivityPage))
