import { connect } from 'react-redux'
import { getStats } from 'modules/ui/selectors'
import SidebarStats from './SidebarStats'

const mapState = state => {
  return {
    stats: getStats(state)
  }
}

const mapDispatch = dispatch => ({})

export default connect(mapState, mapDispatch)(SidebarStats)
