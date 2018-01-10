import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { changeRange, setLoading, selectParcel } from 'modules/ui/actions'
import { navigateTo } from 'modules/location/actions'
import MapComponent from './Map'

const mapState = (state, ownProps) => {
  return {
    isReady: ownProps.isReady,
    center: ownProps.match.params // from withRouter
  }
}

const mapDispatch = dispatch => ({
  onNavigate: location => dispatch(navigateTo(location)),
  onLoading: () => dispatch(setLoading(true)),
  onRangeChange: (nw, se) => dispatch(changeRange(nw, se)),
  onSelect: (x, y) => dispatch(selectParcel(x, y))
})

export default withRouter(connect(mapState, mapDispatch)(MapComponent))
