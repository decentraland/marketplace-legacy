import { connect } from 'react-redux'

import { getData as getParcels } from 'modules/parcels/selectors'
import { getAddress, isConnecting } from 'modules/wallet/selectors'
import {
  isLoading,
  getData as getAuthorizations
} from 'modules/authorization/selectors'
import { openModal } from 'modules/ui/actions'

import AuctionPage from './AuctionPage'

const mapState = state => {
  const address = getAddress(state)
  const authorization = getAuthorizations(state)[address]

  return {
    authorization,
    isAuthorizationLoading: isConnecting(state) || isLoading(state),
    allParcels: getParcels(state)
  }
}

const mapDispatch = (dispatch, ownProps) => ({
  onShowAuctionModal: () => dispatch(openModal('AuctionModal'))
})

export default connect(mapState, mapDispatch)(AuctionPage)
