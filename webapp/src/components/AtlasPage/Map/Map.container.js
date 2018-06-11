import { withRouter } from 'react-router'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'

import { locations } from 'locations'
import { getData as getParcels } from 'modules/parcels/selectors'
import { isConnecting } from 'modules/wallet/selectors'
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
    isLoading: isConnecting(state),
    center: {
      x: parseInt(match.params.x, 10) || 0,
      y: parseInt(match.params.y, 10) || 0
    },
    selected
  }
}

const mapDispatch = (dispatch, { location }) => ({
  onLoading: () => dispatch(setLoading(true)),
  onChange: (x, y, marker) =>
    dispatch(push(locations.parcelMapDetail(x, y, marker))),
  onSelect: (x, y) => dispatch(push(locations.parcelDetail(x, y)))
})

export default withRouter(connect(mapState, mapDispatch)(MapComponent))
