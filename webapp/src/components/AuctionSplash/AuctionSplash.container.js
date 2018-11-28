import { connect } from 'react-redux'
import { navigateTo } from '@dapps/modules/location/actions'

import { locations } from 'locations'
import AuctionSplash from './AuctionSplash'

const mapState = () => ({})

const mapDispatch = dispatch => ({
  onSubmit: () => dispatch(navigateTo(locations.marketplace()))
})

export default connect(mapState, mapDispatch)(AuctionSplash)
