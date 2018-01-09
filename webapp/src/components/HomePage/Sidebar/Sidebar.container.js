import { connect } from 'react-redux'
import { selectors } from 'reducers'
import { openSidebar, closeSidebar } from 'actions'
import Sidebar from './Sidebar'

const mapState = state => {
  return {
    address: selectors.getAddress(state),
    isLoading: selectors.getLoading(state),
    isOpen: selectors.getSidebar(state).open
  }
}

const mapDispatch = dispatch => ({
  onOpen: () => dispatch(openSidebar()),
  onClose: () => dispatch(closeSidebar())
})

export default connect(mapState, mapDispatch)(Sidebar)
