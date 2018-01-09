import { connect } from 'react-redux'
import { selectors } from 'reducers'
import Intercom from './Intercom'

const mapState = state => {
  return {
    ethereum: selectors.getEthereumConnection(state)
  }
}

const mapDispatch = dispatch => ({})

export default connect(mapState, mapDispatch)(Intercom)
