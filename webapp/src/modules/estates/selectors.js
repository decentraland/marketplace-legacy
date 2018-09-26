import { createSelector } from 'reselect'
import { isLoadingType } from '@dapps/modules/loading/selectors'
import { getData as getParcels } from 'modules/parcels/selectors'
import { getPublications } from 'modules/publication/selectors'
import { buildCoordinate } from 'shared/parcel'
import { lazy } from 'lib/reselect'
import {
  CREATE_ESTATE_REQUEST,
  EDIT_ESTATE_METADATA_REQUEST,
  DELETE_ESTATE_REQUEST,
  EDIT_ESTATE_PARCELS_REQUEST,
  TRANSFER_ESTATE_REQUEST
} from './actions'

export const getState = state => state.estates
export const getData = state => getState(state).data
export const getLoading = state => getState(state).loading
export const getError = state => getState(state).error

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

export const getEstates = lazy(() =>
  createSelector(
    getData,
    getParcels,
    getPublications,
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
)
