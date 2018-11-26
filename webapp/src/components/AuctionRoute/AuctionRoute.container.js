import { connect } from 'react-redux'

import { isConnected } from 'modules/wallet/selectors'
import { fetchAuctionParamsRequest } from 'modules/auction/actions'
import AuctionRoute from './AuctionRoute'

const mapState = state => {
  return {
    isConnected: isConnected(state)
  }
}

const mapDispatch = dispatch => ({
  onFetchAuctionParams: () => dispatch(fetchAuctionParamsRequest())
})

export default connect(mapState, mapDispatch)(AuctionRoute)
