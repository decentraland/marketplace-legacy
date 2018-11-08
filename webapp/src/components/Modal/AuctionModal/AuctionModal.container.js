import { connect } from 'react-redux'

import { locations } from 'locations'
import { navigateTo } from '@dapps/modules/location/actions'
import { getAuthorizations } from 'modules/authorization/selectors'

import AuctionModal from './AuctionModal'

const mapState = state => ({
  authorization: getAuthorizations(state)
})

const mapDispatch = dispatch => ({
  onAuthorize: () => dispatch(navigateTo(locations.settings()))
})

export default connect(mapState, mapDispatch)(AuctionModal)
