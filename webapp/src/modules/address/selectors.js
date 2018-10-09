import { createSelector } from 'reselect'

import {
  getData as getParcels,
  getMortgagedParcels
} from 'modules/parcels/selectors'
import { getData as getPublications } from 'modules/publication/selectors'
import { getDistricts } from 'modules/districts/selectors'
import { getEstates } from 'modules/estates/selectors'
import { getData as getAuthorizations } from 'modules/authorization/selectors'
import { isOpen } from 'shared/publication'
import { pickAndMap } from './utils'

export const getState = state => state.address
export const getData = state => getState(state).data
export const getLoading = state => getState(state).loading
export const isLoading = state => getLoading(state).length > 0
export const getError = state => getState(state).error
export const getAddresses = createSelector(
  state => getData(state),
  state => getDistricts(state),
  state => getParcels(state),
  state => getPublications(state),
  state => getEstates(state),
  state => getMortgagedParcels(state),
  state => getAuthorizations(state),
  (
    data,
    allDistricts,
    allParcels,
    allPublications,
    allEstates,
    allMortgagedParcels,
    allAuthorizations
  ) =>
    Object.keys(data).reduce((map, address) => {
      const parcelIds = data[address].parcel_ids || []
      const [parcels, parcelsById] = pickAndMap(allParcels, parcelIds)

      const estatesIds = data[address].estate_ids || []
      const [estates, estatesById] = pickAndMap(allEstates, estatesIds)

      const contributions = (data[address].contributions || []).map(
        contribution => ({
          ...contribution,
          district: allDistricts[contribution.district_id]
        })
      )

      // filter only open publications
      const publishedParcels = parcels.filter(parcel =>
        isOpen(allPublications[parcel.publication_tx_hash])
      )

      const publishedEstates = estates.filter(estate =>
        isOpen(allPublications[estate.publication_tx_hash])
      )

      const mortgagedParcels = allMortgagedParcels.filter(
        parcel => parcel.mortgage.borrower === address
      )

      const authorization = allAuthorizations[address]

      return {
        ...map,
        [address]: {
          ...data[address],
          mortgagedParcels,
          parcels,
          parcelsById,
          estates,
          estatesById,
          contributions,
          publishedParcels,
          publishedEstates,
          authorization
        }
      }
    }, {})
)
