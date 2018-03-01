import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import { getData as getTransactions } from 'modules/transaction/selectors'
import { isParcelPendingTransaction } from './utils'

import TxStatusParcel from './TxStatusParcel'

const mapState = (state, { parcel }) => {
  const transactions = getTransactions(state).filter(tx =>
    isParcelPendingTransaction(parcel, tx)
  )

  return {
    parcel,
    transactions
  }
}

const mapDispatch = () => ({})

export default withRouter(connect(mapState, mapDispatch)(TxStatusParcel))
