import { connect } from 'react-redux'
import { selectors } from 'reducers'
import { isLoading } from 'modules/ui/loading/reducer'
import { isOpen } from 'modules/ui/sidebar/reducer'
import { openSidebar, closeSidebar } from 'modules/ui/sidebar/actions'
import Sidebar from './Sidebar'

const mapState = state => {
  return {
    address: selectors.getAddress(state),
    isLoading: isLoading(state),
    isOpen: isOpen(state)
  }
}

const mapDispatch = dispatch => ({
  onOpen: () => dispatch(openSidebar()),
  onClose: () => dispatch(closeSidebar())
})

export default connect(mapState, mapDispatch)(Sidebar)
