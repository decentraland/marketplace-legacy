import { connect } from 'react-redux'
import { isConnected } from '@dapps/modules/wallet/selectors'

import AuctionModal from './AuctionModal'

const mapState = state => ({
  isConnected: isConnected(state)
})

const mapDispatch = dispatch => ({})

export default connect(mapState, mapDispatch)(AuctionModal)
