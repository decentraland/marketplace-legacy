import { connect } from 'react-redux'

import { locations } from 'locations'
import { navigateTo } from '@dapps/modules/location/actions'
import { getAddress } from 'modules/wallet/selectors'
import { getData as getAuthorizations } from 'modules/authorization/selectors'

import AuctionModal from './AuctionModal'

const mapState = state => {
  const address = getAddress(state)
  const authorization = getAuthorizations(state)[address]

  return { authorization }
}

const mapDispatch = dispatch => ({
  onAuthorize: () => dispatch(navigateTo(locations.settings()))
})

export default connect(mapState, mapDispatch)(AuctionModal)
