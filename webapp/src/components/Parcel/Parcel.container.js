import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { locations } from 'locations'
import { fetchParcelRequest } from 'modules/parcels/actions'
import { getData as getParcels, getLoading } from 'modules/parcels/selectors'
import { buildCoordinate, splitCoordinate } from 'shared/parcel'

import Parcel from './Parcel'

const mapState = (state, { x, y, id = buildCoordinate(x, y) }) => {
  const parcels = getParcels(state)
  const isLoading = getLoading(state).some(parcel => parcel.id === id)
  const parcel = parcels[id]

  return {
    isLoading,
    parcel
  }
}

const mapDispatch = (dispatch, { x, y, id }) => {
  if (id) {
    const coords = splitCoordinate(id)
    x = coords[0]
    y = coords[1]
  }

  return {
    onLoaded: () => dispatch(fetchParcelRequest(x, y)),
    onAccessDenied: () => dispatch(push(locations.parcelDetail(x, y)))
  }
}

export default connect(mapState, mapDispatch)(Parcel)
