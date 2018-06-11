import { createSelector } from 'reselect'

import {
  getData as getParcels,
  getMortgagedParcels
} from 'modules/parcels/selectors'
import { getPublications } from 'modules/publication/selectors'
import { getDistricts } from 'modules/districts/selectors'
import { isOpen } from 'shared/asset'
import { PUBLICATION_STATUS } from 'shared/publication'
import { getEstates } from 'modules/estates/selectors'
import { pickAndMap } from './utils'

export const getState = state => state.address
export const getData = state => getState(state).data
export const getLoading = state => getState(state).loading
export const isLoading = state => getLoading(state).length > 0
export const getError = state => getState(state).error
export const getAddresses = createSelector(
  getData,
  getDistricts,
  getParcels,
  getPublications,
  getEstates,
  getMortgagedParcels,
  (data, districts, allParcels, publications, allEstates, mortgagedParcels) =>
    Object.keys(data).reduce((map, address) => {
      const parcelIds = data[address].parcel_ids || []
      const [parcels, parcelsById] = pickAndMap(allParcels, parcelIds)

      const estatesIds = data[address].estate_ids || []
      const [estates, estatesById] = pickAndMap(allEstates, estatesIds)

      const contributions = (data[address].contributions || []).map(
        contribution => ({
          ...contribution,
          district: districts[contribution.district_id]
        })
      )

      // filter only open publications
      const publishedParcels = parcels.filter(parcel =>
        isOpen(
          publications[parcel.publication_tx_hash],
          PUBLICATION_STATUS.open
        )
      )

      const mortgagedParcelsByAddress = mortgagedParcels.filter(
        parcel => parcel.mortgage.borrower === address
      )

      return {
        ...map,
        [address]: {
          ...data[address],
          mortgagedParcels: mortgagedParcelsByAddress,
          parcels,
          parcelsById,
          estates: estates.filter(e => e.data.parcels.length > 0),
          estatesById,
          contributions,
          publishedParcels
        }
      }
    }, {})
)
