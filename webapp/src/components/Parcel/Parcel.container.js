import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { locations } from 'locations'
import { fetchParcelRequest } from 'modules/parcels/actions'
import { getData as getParcels, getLoading } from 'modules/parcels/selectors'
import { buildCoordinate, getCoordsMatcher } from 'shared/parcel'

import Parcel from './Parcel'

const mapState = (state, { x, y }) => {
  const parcels = getParcels(state)
  const isLoading = getLoading(state).some(getCoordsMatcher({ x, y }))
  const parcel = parcels[buildCoordinate(x, y)]

  return {
    isLoading,
    parcel
  }
}

const mapDispatch = (dispatch, { x, y }) => ({
  onLoaded: () => dispatch(fetchParcelRequest(x, y)),
  onAccessDenied: () => dispatch(push(locations.parcelDetail(x, y)))
})

export default connect(mapState, mapDispatch)(Parcel)
