import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { getParcels } from 'modules/parcels/reducer'
import { changeRange, setLoading, selectParcel } from 'modules/ui/actions'
import { navigateTo } from 'modules/location/actions'
import MapComponent from './Map'

const mapState = (state, ownProps) => {
  const parcels = getParcels(state)

  return {
    isReady: ownProps.isReady,
    center: ownProps.match.params, // from withRouter
    parcels
  }
}

let counter = 0

const mapDispatch = dispatch => ({
  onNavigate: location => dispatch(navigateTo(location)),
  onLoading: () => dispatch(setLoading(true)),
  onRangeChange: (nw, se) => {
    // PERF ISSUE
    if (counter++ < Infinity)
      setTimeout(() => dispatch(changeRange(nw, se)), 250)
  },
  onSelect: (x, y) => dispatch(selectParcel(x, y))
})

export default withRouter(connect(mapState, mapDispatch)(MapComponent))
