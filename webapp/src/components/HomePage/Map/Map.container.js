import { withRouter } from 'react-router'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import { locations } from 'locations'
import { getWallet } from 'modules/wallet/selectors'
import { getParcels } from 'modules/parcels/selectors'
import { getDistricts } from 'modules/districts/selectors'
import { changeRange, setLoading } from 'modules/ui/actions'
import { navigateTo } from 'modules/location/actions'
import { hoverParcel } from 'modules/ui/actions'
import MapComponent from './Map'
import { getMarker } from './utils'

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
  onNavigate: location => dispatch(navigateTo(location)),
  onLoading: () => dispatch(setLoading(true)),
  onRangeChange: (nw, se) =>
    setTimeout(() => dispatch(changeRange(nw, se)), 250),
  onSelect: (x, y) => dispatch(push(locations.parcelDetail(x, y))),
  onHover: (x, y) => dispatch(hoverParcel(x, y))
})

export default withRouter(connect(mapState, mapDispatch)(MapComponent))
