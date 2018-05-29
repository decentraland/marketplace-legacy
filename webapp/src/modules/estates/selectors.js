import { createSelector } from 'reselect'
import { getParcels } from 'modules/parcels/selectors'

export const getState = state => state.estates
export const getData = state => getState(state).data

export const getEstates = createSelector(
  getData,
  getParcels,
  (estates, parcels) => {
    Object.keys(estates).reduce((estates, estateId) => {
      const estate = estates[estateId]
      estates[estateId] = {
        ...estate,
        parcels: estate.data.parcels.map(id => parcels[id])
      }
      return estates
    })
  }
)
