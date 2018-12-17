import { connect } from 'react-redux'

import { isConnected } from '@dapps/modules/wallet/selectors'

import AuctionCountdown from './AuctionCountdown'

const mapState = state => {
  return {
    isConnected: isConnected(state)
  }
}

const mapDispatch = dispatch => ({})

export default connect(mapState, mapDispatch)(AuctionCountdown)
