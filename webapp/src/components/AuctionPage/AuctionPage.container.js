import { connect } from 'react-redux'

import { getData as getParcels } from 'modules/parcels/selectors'
import AuctionPage from './AuctionPage'

const mapState = state => ({
  allParcels: getParcels(state)
})

const mapDispatch = dispatch => {
  return {}
}

export default connect(mapState, mapDispatch)(AuctionPage)
