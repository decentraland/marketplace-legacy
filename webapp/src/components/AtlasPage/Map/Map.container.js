import { withRouter } from 'react-router'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'

import { locations } from 'locations'
import { getWallet } from 'modules/wallet/selectors'
import { getParcels } from 'modules/parcels/selectors'
import { getDistricts } from 'modules/districts/selectors'
import { changeRange, setLoading } from 'modules/ui/actions'
import { navigateTo } from 'modules/location/actions'
import { getMarker } from './utils'
import MapComponent from './Map'

const mapState = (state, { isReady, match, location }) => {
  const wallet = getWallet(state)
  const parcels = getParcels(state)
  const districts = getDistricts(state)

  return {
    isReady,
    center: match.params, // from withRouter
    parcels,
    districts,
    wallet,
    marker: getMarker(location)
  }
}

const mapDispatch = (dispatch, { location }) => ({
  onNavigate: url => dispatch(navigateTo(url)),
  onLoading: () => dispatch(setLoading(true)),
  onRangeChange: (center, nw, se) =>
    setTimeout(() => dispatch(changeRange(center, nw, se)), 250),
  onSelect: (x, y) => dispatch(push(locations.parcelDetail(x, y)))
})

export default withRouter(connect(mapState, mapDispatch)(MapComponent))
