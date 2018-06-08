import { createSelector } from 'reselect'
import { getData as getParcels } from 'modules/parcels/selectors'
import { getPublications } from 'modules/publication/selectors'
import { buildCoordinate } from 'shared/parcel'

export const getState = state => state.estates
export const getData = state => getState(state).data

export const getEstates = createSelector(
  getData,
  getParcels,
  getPublications,
  (estates, parcels, publications) =>
    Object.keys(estates).reduce((acc, estateId) => {
      const estate = estates[estateId]
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
      return acc
    }, {})
)
