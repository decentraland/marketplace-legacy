import { createSelector } from 'reselect'
import { getParcels } from 'modules/parcels/selectors'
import { getDistricts } from 'modules/districts/selectors'
import { getPublications } from 'modules/publication/selectors'
import { PUBLICATION_STATUS } from 'modules/publication/utils'
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
  getPublications,
  (data, allParcels, districts, allPublications) =>
    Object.keys(data).reduce((map, address) => {
      const parcelIds = data[address].parcel_ids || []
      const [parcels, parcelsById] = pickAndMap(allParcels, parcelIds)

      const allContributions = (data[address].contributions || []).map(
        contribution => ({
          ...contribution,
          district: districts[contribution.district_id]
        })
      )
      const contributionIds = allContributions.map(
        (contribution, index) => index
      )
      const [contributions, contributionsById] = pickAndMap(
        allContributions,
        contributionIds
      )
      const publicationsIds = data[address].publication_ids || []
      let [publications, publicationsById] = pickAndMap(
        allPublications,
        publicationsIds
      )

      // filter only open publications
      publications = publications.filter(
        publication => publication.status === PUBLICATION_STATUS.open
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
