import { createSelector } from 'reselect'
import { PUBLISH_SUCCESS } from './actions'
import { getTransactionsByType } from 'modules/transaction/selectors'

export const getState = state => state.publication
export const getData = state => getState(state).data
export const isLoading = state => getState(state).loading.length > 0
export const getError = state => getState(state).error

export const getPublications = createSelector(
  getData,
  state => getTransactionsByType(state, PUBLISH_SUCCESS),
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
