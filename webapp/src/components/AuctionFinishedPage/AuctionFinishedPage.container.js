import { connect } from 'react-redux'
import { navigateTo } from '@dapps/modules/location/actions'

import { locations } from 'locations'
import { getParams } from 'modules/auction/selectors'
import { isConnected, isConnecting } from 'modules/wallet/selectors'
import AuctionFinishedPage from './AuctionFinishedPage'

const mapState = state => ({
  isConnected: isConnected(state),
  isConnecting: isConnecting(state),
  params: getParams(state)
})

const mapDispatch = dispatch => ({
  onGoToMarketplace: () => dispatch(navigateTo(locations.marketplace()))
})

export default connect(mapState, mapDispatch)(AuctionFinishedPage)
