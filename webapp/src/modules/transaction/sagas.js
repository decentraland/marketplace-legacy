import { takeEvery, put, call, select } from 'redux-saga/effects'
import { txUtils, utils } from 'decentraland-commons'
import {
  FETCH_TRANSACTION_REQUEST,
  WATCH_LOADING_TRANSACTIONS,
  fetchTransactionSuccess,
  fetchTransactionFailure
} from './actions'
import { getData, getLoading } from './selectors'

const { TRANSACTION_STATUS } = txUtils

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
  const transactions = yield select(getData)
  const pendingTransactions = transactions.filter(
    transaction => transaction.status === TRANSACTION_STATUS.pending
  )

  const pendingTxHashes = []
  for (const action of transactionRequests) {
    pendingTxHashes.push(action.hash)
  }
  for (const transaction of pendingTransactions) {
    if (!pendingTxHashes.includes(transaction.hash)) {
      pendingTxHashes.push(transaction.hash)
    }
  }

  for (const hash of pendingTxHashes) {
    if (!watchIndex[hash]) {
      yield handleTransactionRequest({ hash })
    }
  }
}
