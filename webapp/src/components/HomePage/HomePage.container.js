import { connect } from 'react-redux'
import { fetchWallet } from 'modules/wallet/actions'

import HomePage from './HomePage'

const mapState = state => {
  return {
    isReady: true
  }
}

const mapDispatch = dispatch => ({
  onConnect: () => dispatch(fetchWallet())
})

export default connect(mapState, mapDispatch)(HomePage)
