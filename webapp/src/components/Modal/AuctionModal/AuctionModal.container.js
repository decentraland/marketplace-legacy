import { connect } from 'react-redux'
import { navigateTo } from '@dapps/modules/location/actions'

import { locations } from 'locations'
import AuctionModal from './AuctionModal'

const mapState = state => ({})

const mapDispatch = dispatch => ({
  onNavigateAway: () => dispatch(navigateTo(locations.root())),
  onGoToMarketplace: () => dispatch(navigateTo(locations.marketplace()))
})

export default connect(mapState, mapDispatch)(AuctionModal)
