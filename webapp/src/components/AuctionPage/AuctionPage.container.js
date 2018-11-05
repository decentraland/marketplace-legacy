import { connect } from 'react-redux'

import { isConnected } from 'modules/wallet/selectors'
import { getAuthorizations } from 'modules/authorization/selectors'
import { getParams } from 'modules/auction/selectors'
import { getData as getParcels } from 'modules/parcels/selectors'
import { openModal } from 'modules/ui/actions'
import {
  fetchAuctionParamsRequest,
  setParcelOnChainOwner
} from 'modules/auction/actions'
import AuctionPage from './AuctionPage'

const mapState = state => ({
  isConnected: isConnected(state),
  authorization: getAuthorizations(state),
  auctionParams: getParams(state),
  allParcels: getParcels(state)
})

const mapDispatch = dispatch => ({
  onShowAuctionModal: () => dispatch(openModal('AuctionModal')),
  onFetchAuctionParams: () => dispatch(fetchAuctionParamsRequest()),
  onSetParcelOnChainOwner: (parcelId, owner) =>
    dispatch(setParcelOnChainOwner(parcelId, owner))
})

export default connect(mapState, mapDispatch)(AuctionPage)
