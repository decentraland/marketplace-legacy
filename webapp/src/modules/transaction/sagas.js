import { takeEvery, put, call, select } from 'redux-saga/effects'
import { txUtils, utils } from 'decentraland-commons'
import {
  FETCH_TRANSACTION_REQUEST,
  WATCH_LOADING_TRANSACTIONS,
  fetchTransactionSuccess,
  fetchTransactionFailure
} from './actions'
import { getData, getLoading } from './selectors'

export function* transactionSaga() {
  yield takeEvery(FETCH_TRANSACTION_REQUEST, handleTransactionRequest)
  yield takeEvery(WATCH_LOADING_TRANSACTIONS, handleWatchLoadingTransactions)
}

const watchIndex = {
  // hash: true
}

function* handleTransactionRequest(action = {}) {
  const hash = action.hash
  const transactions = yield select(getData)
  const transaction = transactions.find(tx => tx.hash === hash)

  try {
    watchIndex[hash] = true

    const { recepeit, ...tx } = yield call(() =>
      txUtils.getConfirmedTransaction(hash, transaction.events)
    )

    const confirmedTx = utils.omit(tx, ['input', 's', 'r', 'v'])
    confirmedTx.recepeit = utils.omit(recepeit, 'logsBloom')

    delete watchIndex[hash]

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

function* handleWatchLoadingTransactions(action) {
  const transactionRequests = yield select(getLoading)

  for (const action of transactionRequests) {
    if (!watchIndex[action.hash]) {
      yield handleTransactionRequest(action)
    }
  }
}
