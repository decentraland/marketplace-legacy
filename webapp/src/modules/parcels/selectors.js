import { createSelector } from 'reselect'
import { isLoadingType } from '@dapps/modules/loading/selectors'

import {
  EDIT_PARCEL_REQUEST,
  FETCH_PARCEL_REQUEST,
  TRANSFER_PARCEL_REQUEST
} from './actions'
import { MANAGE_ASSET_REQUEST } from 'modules/management/actions'
import { getData as getAllPublications } from 'modules/publication/selectors'
import { getMortgagesArray } from 'modules/mortgage/selectors'
import { buildCoordinate } from 'shared/coordinates'
import { getActiveMortgages } from 'shared/mortgage'

export const getState = state => state.parcels
export const getData = state => getState(state).data
export const isLoading = state => getState(state).loading.length > 0
export const getLoading = state => getState(state).loading
export const getError = state => getState(state).error

export const isEditTransactionIdle = state =>
  isLoadingType(getLoading(state), EDIT_PARCEL_REQUEST)

export const isManageTransactionIdle = state =>
  isLoadingType(getLoading(state), MANAGE_ASSET_REQUEST)

export const isTransferIdle = state =>
  isLoadingType(getLoading(state), TRANSFER_PARCEL_REQUEST)

export const isFetchingParcel = (state, x, y) =>
  getLoading(state).some(
    action =>
      action.type === FETCH_PARCEL_REQUEST && action.x === x && action.y === y
  )

export const getPublications = (x, y) =>
  createSelector(getData, getAllPublications, (parcels, publications) => {
    const parcel = parcels[buildCoordinate(x, y)]

    return parcel.publication_tx_hash_history.map(
      tx_hash => publications[tx_hash]
    )
  })

export const getMortgagedParcels = createSelector(
  state => getData(state),
  state => getMortgagesArray(state),
  state => getAllPublications(state),
  (parcels, mortgages, publications) =>
    getActiveMortgages(mortgages, parcels, publications).map(mortgage => ({
      ...parcels[mortgage.asset_id],
      mortgage
    }))
)
