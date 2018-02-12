import { createSelector } from 'reselect'
import { getParcels } from 'modules/parcels/selectors'
import { getDistricts } from 'modules/districts/selectors'
import { getPublications } from 'modules/publication/selectors'
import { grab } from './utils'

export const getState = state => state.address
export const getData = state => getState(state).data
export const isLoading = state => getState(state).loading.length > 0
export const getError = state => getState(state).error
export const getAddresses = createSelector(
  getData,
  getParcels,
  getDistricts,
  getPublications,
  (data, allParcels, districts, allPublications) =>
    Object.keys(data).reduce((map, address) => {
      const parcelIds = data[address].parcel_ids || []
      const [parcels, parcelsById] = grab(allParcels, parcelIds)

      const allContributions = (data[address].contributions || []).map(
        contribution => ({
          ...contribution,
          district: districts[contribution.district_id]
        })
      )
      const contributionIds = allContributions.map(
        contribution => contribution.id
      )
      const [contributions, contributionsById] = grab(
        allContributions,
        contributionIds
      )

      const publicationsIds = data[address].publications_ids || []
      const [publications, publicationsById] = grab(
        allPublications,
        publicationsIds
      )

      return {
        ...map,
        [address]: {
          ...data[address],
          parcels,
          parcelsById,
          contributions,
          contributionsById,
          publications,
          publicationsById
        }
      }
    }, {})
)
