import { takeEvery, put, call, select } from 'redux-saga/effects'
import { txUtils } from 'decentraland-commons'
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
  const hash = getTransactionHashFromAction(action.actionRef)
  const transactions = yield select(getData)
  const transaction = transactions.find(tx => tx.hash === hash)

  try {
    const confirmedTransaction = yield call(() =>
      txUtils.getConfirmedTransaction(hash, transaction.events)
    )

    yield put(
      fetchTransactionSuccess({
        ...transaction,
        ...confirmedTransaction
      })
    )
  } catch (error) {
    yield put(fetchTransactionFailure(transaction, error.message))
  }
}
