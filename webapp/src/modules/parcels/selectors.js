import { createSelector } from 'reselect'
import {
  EDIT_PARCEL_REQUEST,
  FETCH_PARCEL_REQUEST,
  MANAGE_PARCEL_REQUEST
} from './actions'
import { getPublications as getAllPublications } from 'modules/publication/selectors'
import { buildCoordinate } from 'shared/parcel'
import { isLoadingType } from 'modules/loading/selectors'
import { getMortgagesArray } from 'modules/mortgage/selectors'
import { getActiveMortgages } from 'shared/mortgage'

export const getState = state => state.parcels
export const getData = state => getState(state).data
export const isLoading = state => getState(state).loading.length > 0
export const getLoading = state => getState(state).loading
export const getError = state => getState(state).error

export const isEditTransactionIdle = state =>
  getLoading(state).some(action => action.type === EDIT_PARCEL_REQUEST)

export const isManageTransactionIdle = state =>
  getLoading(state).some(action => action.type === MANAGE_PARCEL_REQUEST)

export const isFetchingParcel = state =>
  isLoadingType(getLoading(state), FETCH_PARCEL_REQUEST)

export const getPublications = (x, y) =>
  createSelector(getData, getAllPublications, (parcels, publications) => {
    const parcel = parcels[buildCoordinate(x, y)]

    return parcel.publication_tx_hash_history.map(
      tx_hash => publications[tx_hash]
    )
  })

export const getMortgagedParcels = createSelector(
  getData,
  getMortgagesArray,
  (parcels, mortgages) =>
    getActiveMortgages(mortgages, parcels).map(mortgage => ({
      ...parcels[mortgage.asset_id],
      mortgage
    }))
)
