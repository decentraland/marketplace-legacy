import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { getWallet } from 'modules/wallet/selectors'
import { getParcels } from 'modules/parcels/selectors'
import { getDistricts } from 'modules/districts/selectors'
import { changeRange, setLoading, selectParcel } from 'modules/ui/actions'
import { navigateTo } from 'modules/location/actions'
import MapComponent from './Map'
import { hoverParcel } from 'modules/ui/actions'

const mapState = (state, ownProps) => {
  const wallet = getWallet(state)
  const parcels = getParcels(state)
  const districts = getDistricts(state)

  return {
    isReady: ownProps.isReady,
    center: ownProps.match.params, // from withRouter
    parcels,
    districts,
    wallet
  }
}

const mapDispatch = dispatch => ({
  onNavigate: location => dispatch(navigateTo(location)),
  onLoading: () => dispatch(setLoading(true)),
  onRangeChange: (nw, se) =>
    setTimeout(() => dispatch(changeRange(nw, se)), 250),
  onSelect: (x, y) => dispatch(selectParcel(x, y)),
  onHover: (x, y) => dispatch(hoverParcel(x, y))
})

export default withRouter(connect(mapState, mapDispatch)(MapComponent))
