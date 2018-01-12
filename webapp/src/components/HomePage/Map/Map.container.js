import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { getWallet } from 'modules/wallet/reducer'
import { getParcels } from 'modules/parcels/reducer'
import { getDistricts } from 'modules/districts/reducer'
import { changeRange, setLoading, selectParcel } from 'modules/ui/actions'
import { navigateTo } from 'modules/location/actions'
import MapComponent from './Map'

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
  onSelect: (x, y) => dispatch(selectParcel(x, y))
})

export default withRouter(connect(mapState, mapDispatch)(MapComponent))
