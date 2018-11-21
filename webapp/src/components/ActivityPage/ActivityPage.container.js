import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import { getTransactions } from '@dapps/modules/transaction/selectors'
import {
  getNetwork,
  getAddress,
  isConnecting,
  isConnected
} from '@dapps/modules/wallet/selectors'
import { clearTransactions } from '@dapps/modules/transaction/actions'

import { getAuthorizations } from 'modules/authorization/selectors'

import ActivityPage from './ActivityPage'

const mapState = state => {
  const address = getAddress(state)

  const transactions = getTransactions(state, address)
  const authorization = getAuthorizations(state)

  return {
    address,
    authorization,
    transactions,
    network: getNetwork(state),
    isEmpty: transactions.length === 0,
    isLoading: isConnecting(state) || authorization == null,
    isConnected: isConnected(state)
  }
}

const mapDispatch = dispatch => ({
  onClear: address => dispatch(clearTransactions(address))
})

export default withRouter(connect(mapState, mapDispatch)(ActivityPage))
