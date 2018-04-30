import { createSelector } from 'reselect'
import { EDIT_PARCEL_REQUEST } from './actions'
import { getPublications as getAllPublications } from 'modules/publication/selectors'
import { buildCoordinate } from 'lib/utils'

export const getState = state => state.parcels
export const getData = state => getState(state).data
export const isLoading = state => getState(state).loading.length > 0
export const getLoading = state => getState(state).loading
export const getError = state => getState(state).error

export const isEditTransactionIdle = state =>
  getLoading(state).some(action => action.type === EDIT_PARCEL_REQUEST)

export const getParcels = createSelector(
  getData,
  getAllPublications,
  (allParcels, publications) =>
    Object.keys(allParcels).reduce((parcels, parcelId) => {
      const parcel = allParcels[parcelId]
      parcels[parcelId] = {
        ...parcel,
        publication: publications[parcel.publication_tx_hash]
      }
      return parcels
    }, {})
)

export const getPublications = (x, y) =>
  createSelector(getParcels, getAllPublications, (parcels, publications) => {
    const parcel = parcels[buildCoordinate(x, y)]

    return parcel.publication_tx_hash_history.map(
      tx_hash => publications[tx_hash]
    )
  })
