import { createSelector } from 'reselect'
import {
  PUBLISH_REQUEST,
  PUBLISH_SUCCESS,
  CANCEL_SALE_REQUEST
} from './actions'
import { getData as getParcels } from 'modules/parcels/selectors'
import { isLoadingType } from 'modules/loading/selectors'
import { getAddress } from 'modules/wallet/selectors'
import { getTransactionsByType } from 'modules/transaction/selectors'
import { PUBLICATION_STATUS, findAssetPublications } from 'shared/publication'
import { buildCoordinate } from 'shared/parcel'

export const getState = state => state.publication
export const getData = state => getState(state).data
export const isLoading = state => getState(state).loading.length > 0
export const getLoading = state => getState(state).loading
export const getError = state => getState(state).error

export const isPublishingIdle = state =>
  isLoadingType(getLoading(state), PUBLISH_REQUEST)

export const isCancelIdle = state =>
  isLoadingType(getLoading(state), CANCEL_SALE_REQUEST)

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

export const getPublicationByCoordinate = (state, x, y) => {
  const parcels = getParcels(state)
  const parcel = parcels[buildCoordinate(x, y)]
  let publication = null

  if (parcel) {
    const publications = getData(state)
    const parcelPublications = findAssetPublications(
      publications,
      parcel,
      PUBLICATION_STATUS.open
    )
    publication = parcelPublications[0]
  }

  return publication
}
