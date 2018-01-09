import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { navigateTo, setLoading } from 'actions'
import MapComponent from './Map'

const mapState = (state, ownProps) => {
  return {
    isReady: ownProps.isReady,
    center: ownProps.match.params // from withRouter
  }
}

const mapDispatch = dispatch => ({
  onNavigate: location => dispatch(navigateTo(location)),
  onLoading: () => dispatch(setLoading(true))
})

export default withRouter(connect(mapState, mapDispatch)(MapComponent))
