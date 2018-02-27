import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { txUtils } from 'decentraland-commons'

import { getData as getTransactions } from 'modules/transaction/selectors'

import TxStatusParcel from './TxStatusParcel'

const mapState = (state, { parcel }) => {
  const transactions = getTransactions(state)
    .filter(tx => tx.payload.parcel.id === parcel.id)
    .filter(tx => tx.status === txUtils.TRANSACTION_STATUS.pending)

  return {
    parcel,
    transactions
  }
}

const mapDispatch = () => ({})

export default withRouter(connect(mapState, mapDispatch)(TxStatusParcel))
