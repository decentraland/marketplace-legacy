import { connect } from 'react-redux'
import { connectWeb3 } from 'actions'

import HomePage from './HomePage'

const mapState = state => {
  return {
    isReady: true
  }
}

const mapDispatch = dispatch => ({
  onConnect: () => dispatch(connectWeb3())
})

export default connect(mapState, mapDispatch)(HomePage)
