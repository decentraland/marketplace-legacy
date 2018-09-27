import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import { getData as getTransactions } from '@dapps/modules/transaction/selectors'
import { isAssetPendingTransaction } from './utils'

import TxStatusAsset from './TxStatusAsset'

const mapState = (state, { asset }) => {
  const transactions = getTransactions(state).filter(tx =>
    isAssetPendingTransaction(asset, tx)
  )

  return {
    transactions
  }
}

export default withRouter(connect(mapState)(TxStatusAsset))
