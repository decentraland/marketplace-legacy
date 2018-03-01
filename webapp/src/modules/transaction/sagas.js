import { takeEvery, put, call, select } from 'redux-saga/effects'
import { txUtils, utils } from 'decentraland-commons'
import {
  FETCH_TRANSACTION_REQUEST,
  fetchTransactionSuccess,
  fetchTransactionFailure
} from './actions'
import { getTransactionHashFromAction } from './utils'
import { getData } from './selectors'

export function* transactionSaga() {
  yield takeEvery(FETCH_TRANSACTION_REQUEST, handleTransactionRequest)
}

function* handleTransactionRequest(action = {}) {
  const actionRef = action.action
  const hash = getTransactionHashFromAction(actionRef)
  const transactions = yield select(getData)
  const transaction = transactions.find(tx => tx.hash === hash)

  try {
    let { recepeit, ...tx } = yield call(() =>
      txUtils.getConfirmedTransaction(hash, transaction.events)
    )

    const confirmedTx = utils.omit(tx, ['input', 's', 'r', 'v'])
    confirmedTx.recepeit = utils.omit(recepeit, 'logsBloom')

    yield put(
      fetchTransactionSuccess({
        ...transaction,
        ...confirmedTx
      })
    )
  } catch (error) {
    yield put(fetchTransactionFailure(transaction, error.message))
  }
}
