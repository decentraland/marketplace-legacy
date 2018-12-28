import { withRouter } from 'react-router'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'

import { locations } from 'locations'
import { getData as getParcels } from 'modules/parcels/selectors'
import { getData as getEstates } from 'modules/estates/selectors'
import { getMarker } from './utils'
import MapComponent from './Map'

const mapState = (state, { match, location }) => {
  const parcels = getParcels(state)
  const estates = getEstates(state)
  const marker = getMarker(location)
  let selected = null

  if (marker) {
    if (marker in parcels) {
      selected = parcels[marker]
    } else if (marker in estates) {
      selected = estates[marker].data.parcels
    }
  }

  return {
    center: {
      x: parseInt(match.params.x, 10) || 0,
      y: parseInt(match.params.y, 10) || 0
    },
    selected
  }
}

const mapDispatch = (dispatch, { location }) => ({
  onChange: (x, y) =>
    dispatch(push(locations.parcelMapDetail(x, y, getMarker(location)))),
  onSelect: ({ id, x, y, assetType }) =>
    dispatch(push(locations.assetDetail({ id, x, y }, assetType))) // {id, x, y} are enough props for the asset interface here
})

export default withRouter(connect(mapState, mapDispatch)(MapComponent))
