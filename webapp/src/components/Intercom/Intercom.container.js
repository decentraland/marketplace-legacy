import { connect } from 'react-redux'
import { getAddress } from 'modules/wallet/reducer'
import Intercom from './Intercom'

const mapState = state => {
  return {
    address: getAddress(state)
  }
}

const mapDispatch = dispatch => ({})

export default connect(mapState, mapDispatch)(Intercom)
