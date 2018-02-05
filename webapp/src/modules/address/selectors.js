import { createSelector } from 'reselect'
import { getParcels } from 'modules/parcels/selectors'
import { getDistricts } from 'modules/districts/selectors'

export const getState = state => state.address
export const getData = state => getState(state).data
export const isLoading = state => getState(state).loading
export const getError = state => getState(state).error
export const getAddresses = createSelector(
  getData,
  getParcels,
  getDistricts,
  (data, allParcels, districts) =>
    Object.keys(data).reduce((map, address) => {
      const parcels = []
      const parcelsById = {}
      const parcels_ids = data[address].parcel_ids || []
      parcels_ids.forEach(id => {
        if (allParcels[id]) {
          parcels.push(allParcels[id])
          parcelsById[id] = allParcels[id]
        }
      })

      const contributionsById = {}
      const contributions = []
      if (data[address].contributions) {
        data[address].contributions.forEach(contribution => {
          const newContribution = {
            ...contribution,
            district: districts[contribution.district_id]
          }
          contributions.push(newContribution)
          contributionsById[contribution.district_id] = newContribution
        })
      }

      return {
        ...map,
        [address]: {
          ...data[address],
          parcels,
          parcelsById,
          contributions,
          contributionsById
        }
      }
    }, {})
)
