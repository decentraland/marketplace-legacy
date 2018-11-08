import { connect } from 'react-redux'

import { getData as getParcels } from 'modules/parcels/selectors'
import { isConnecting } from 'modules/wallet/selectors'
import { isLoading, getAuthorizations } from 'modules/authorization/selectors'
import { openModal } from 'modules/ui/actions'

import AuctionPage from './AuctionPage'

const mapState = state => ({
  authorization: getAuthorizations(state),
  isAuthorizationLoading: isConnecting(state) || isLoading(state),
  allParcels: getParcels(state)
})

const mapDispatch = (dispatch, ownProps) => ({
  onShowAuctionModal: () => dispatch(openModal('AuctionModal'))
})

export default connect(mapState, mapDispatch)(AuctionPage)
