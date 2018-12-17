import { createSelector } from 'reselect'
import { isLoadingType } from '@dapps/modules/loading/selectors'

import {
  CREATE_ESTATE_REQUEST,
  EDIT_ESTATE_METADATA_REQUEST,
  DELETE_ESTATE_REQUEST,
  EDIT_ESTATE_PARCELS_REQUEST,
  TRANSFER_ESTATE_REQUEST,
  FETCH_ESTATE_REQUEST
} from './actions'
import { getData as getParcels } from 'modules/parcels/selectors'
import { getData as getPublications } from 'modules/publication/selectors'
import { MANAGE_ASSET_REQUEST } from 'modules/management/actions'
import { buildCoordinate } from 'shared/coordinates'

export const getState = state => state.estates
export const getData = state => getState(state).data
export const getLoading = state => getState(state).loading
export const getError = state => getState(state).error

export const isFetchingEstate = state =>
  isLoadingType(getLoading(state), FETCH_ESTATE_REQUEST)

export const isCreatingEstateTransactionIdle = state =>
  isLoadingType(getLoading(state), CREATE_ESTATE_REQUEST)

export const isEditingMetadataTransactionIdle = state =>
  isLoadingType(getLoading(state), EDIT_ESTATE_METADATA_REQUEST)

export const isDeletingEstateTransactionIdle = state =>
  isLoadingType(getLoading(state), DELETE_ESTATE_REQUEST)

export const isEditingParcelTransactionIdle = state =>
  isLoadingType(getLoading(state), EDIT_ESTATE_PARCELS_REQUEST)

export const isTransferIdle = state =>
  isLoadingType(getLoading(state), TRANSFER_ESTATE_REQUEST)

export const isEstateTransactionIdle = state =>
  isCreatingEstateTransactionIdle(state) ||
  isEditingMetadataTransactionIdle(state) ||
  isEditingParcelTransactionIdle(state) ||
  isDeletingEstateTransactionIdle(state)

export const isManageTransactionIdle = state =>
  isLoadingType(getLoading(state), MANAGE_ASSET_REQUEST)

export const getEstates = createSelector(
  state => getData(state),
  state => getParcels(state),
  state => getPublications(state),
  (estates, parcels, publications) =>
    Object.keys(estates).reduce((acc, estateId) => {
      const estate = estates[estateId]
      if (estate) {
        acc[estateId] = {
          ...estate,
          parcels: estate.data.parcels
            .map(p => parcels[buildCoordinate(p.x, p.y)])
            .filter(parcel => parcel) // Remove undefined elements
            .map(parcel => ({
              ...parcel,
              publication:
                parcel.publication_tx_hash in publications
                  ? publications[parcel.publication_tx_hash]
                  : null
            }))
        }
      }
      return acc
    }, {})
)

export const getEstate = (state, { id }) => getEstates(state)[id]

export const areParcelsLoaded = createSelector(
  (state, props) => getEstate(state, props),
  state => getParcels(state),
  (estate, parcels) => {
    if (!estate) {
      return false
    }
    return estate.data.parcels.every(({ x, y }) => {
      const parcelId = buildCoordinate(x, y)
      const parcel = parcels[parcelId]
      return parcel != null
    })
  }
)
