import { connect } from 'react-redux'
import { navigateTo } from '@dapps/modules/location/actions'

import { locations } from 'locations'
import { fetchAuctionParamsRequest } from 'modules/auction/actions'
import { getParams } from 'modules/auction/selectors'
import AuctionFinishedPage from './AuctionFinishedPage'

const mapState = state => ({
  params: getParams(state)
})

const mapDispatch = dispatch => ({
  onGoToMarketplace: () => dispatch(navigateTo(locations.marketplace())),
  onFetchAuctionParams: () => dispatch(fetchAuctionParamsRequest())
})

export default connect(mapState, mapDispatch)(AuctionFinishedPage)
