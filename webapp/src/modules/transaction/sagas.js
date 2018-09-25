import { takeEvery, put, call, select } from 'redux-saga/effects'
import { txUtils } from 'decentraland-eth'
import {
  FETCH_TRANSACTION_REQUEST,
  WATCH_LOADING_TRANSACTIONS,
  fetchTransactionSuccess,
  fetchTransactionFailure
} from './actions'
import { getData, getLoading } from './selectors'

const { TRANSACTION_TYPES } = txUtils

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

    const receipt = yield call(() =>
      txUtils.getConfirmedTransaction(hash, transaction.events, 120)
    )

    delete watchIndex[hash]

    yield put(
      fetchTransactionSuccess({
        ...transaction,
        status: TRANSACTION_TYPES.confirmed,
        receipt: {
          logs: transaction.withReceipt ? receipt.receipt.logs : []
        }
      })
    )
  } catch (error) {
    yield put(
      fetchTransactionFailure(
        {
          ...transaction,
          status: TRANSACTION_TYPES.failed
        },
        error.message
      )
    )
  }
}

function* handleWatchLoadingTransactions(action) {
  const transactionRequests = yield select(getLoading)

  const transactions = yield select(getData)
  const pendingTransactions = transactions.filter(
    transaction => transaction.status === TRANSACTION_TYPES.pending
  )

  const allTransactions = transactionRequests.concat(pendingTransactions)

  for (const { hash } of allTransactions) {
    if (!watchIndex[hash]) {
      yield handleTransactionRequest({ hash })
    }
  }
}
