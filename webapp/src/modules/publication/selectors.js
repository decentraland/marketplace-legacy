import { createSelector } from 'reselect'
import { PUBLISH_REQUEST, PUBLISH_SUCCESS } from './actions'
import { getAddress } from 'modules/wallet/selectors'
import { getTransactionsByType } from 'modules/transaction/selectors'

export const getState = state => state.publication
export const getData = state => getState(state).data
export const isLoading = state => getState(state).loading.length > 0
export const getLoading = state => getState(state).loading
export const getError = state => getState(state).error

export const isTxIdle = state =>
  getLoading(state).some(action => action.type === PUBLISH_REQUEST)

export const getPublications = createSelector(
  getData,
  state => getTransactionsByType(state, getAddress(state), PUBLISH_SUCCESS),
  (publications = {}, publishTransactions) => {
    const txPublications = {}

    for (const transaction of publishTransactions) {
      const publication = transaction.payload

      txPublications[publication.tx_hash] = {
        ...publications[publication.tx_hash],
        ...publication,
        tx_status: transaction.status
      }
    }

    return {
      ...publications,
      ...txPublications
    }
  }
)
