import { withRouter } from 'react-router'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'

import { locations } from 'locations'
import { getData as getParcels } from 'modules/parcels/selectors'
import { setLoading } from 'modules/ui/actions'
import { getMarker } from './utils'
import MapComponent from './Map'

const mapState = (state, { match, location }) => {
  const parcels = getParcels(state)
  const marker = getMarker(location)
  let selected = null

  if (marker && parcels[marker]) {
    selected = parcels[marker]
  }

  return {
    center: {
      x: parseInt(match.params.x, 10) || 0,
      y: parseInt(match.params.y, 10) || 0
    },
    selected
  }
}

const mapDispatch = dispatch => ({
  onLoading: () => dispatch(setLoading(true)),
  onChange: (x, y, marker) =>
    dispatch(push(locations.parcelMapDetail(x, y, marker))),
  onSelect: asset => dispatch(push(locations.assetDetail(asset)))
})

export default withRouter(connect(mapState, mapDispatch)(MapComponent))
