import { createSelector } from 'reselect'
import { getParcels } from 'modules/parcels/selectors'
import { getDistricts } from 'modules/districts/selectors'
import { isOpen } from 'modules/publication/utils'
import { pickAndMap } from './utils'

export const getState = state => state.address
export const getData = state => getState(state).data
export const getLoading = state => getState(state).loading
export const isLoading = state => getLoading(state).length > 0
export const getError = state => getState(state).error
export const getAddresses = createSelector(
  getData,
  getParcels,
  getDistricts,
  (data, allParcels, districts) =>
    Object.keys(data).reduce((map, address) => {
      const parcelIds = data[address].parcel_ids || []
      const [parcels, parcelsById] = pickAndMap(allParcels, parcelIds)

      const contributions = (data[address].contributions || []).map(
        contribution => ({
          ...contribution,
          district: districts[contribution.district_id]
        })
      )

      // filter only open publications
      const publishedParcels = parcels.filter(parcel =>
        isOpen(parcel.publication)
      )

      return {
        ...map,
        [address]: {
          ...data[address],
          parcels,
          parcelsById,
          contributions,
          publishedParcels
        }
      }
    }, {})
)
