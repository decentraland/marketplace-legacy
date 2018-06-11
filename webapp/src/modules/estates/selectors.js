import { createSelector } from 'reselect'
import { getParcels } from 'modules/parcels/selectors'
import { buildCoordinate } from 'lib/utils'

export const getState = state => state.estates
export const getData = state => getState(state).data
export const isLoading = state => getState(state).loading.length > 0

export const getEstates = createSelector(
  getData,
  getParcels,
  (estates, parcels) =>
    Object.keys(estates).reduce((acc, estateId) => {
      const estate = estates[estateId]
      acc[estateId] = {
        ...estate,
        parcels: estate.data.parcels
          .map(p => parcels[buildCoordinate(p.x, p.y)])
          .filter(parcel => parcel) // Remove undefined elements
      }
      return acc
    }, {})
)
