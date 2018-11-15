import { connect } from 'react-redux'

import { getWallet, isConnected, isConnecting } from 'modules/wallet/selectors'
import { getAuthorizations } from 'modules/authorization/selectors'
import { getData as getParcels } from 'modules/parcels/selectors'
import { getParams, getParcelOnChainOwners } from 'modules/auction/selectors'
import { openModal } from 'modules/ui/actions'
import {
  fetchAuctionParamsRequest,
  setParcelOnChainOwner,
  bidOnParcelsRequest
} from 'modules/auction/actions'
import AuctionPage from './AuctionPage'

const mapState = state => {
  const wallet = getWallet(state)

  const parcelOnChainOwners = getParcelOnChainOwners(state)
  const allParcels = getParcels(state)

  // Side-effect!
  // This particular piece of code mutates the state adding more up to date owners.
  for (const parcelId in parcelOnChainOwners) {
    const parcel = allParcels[parcelId]
    if (!parcel.owner) {
      parcel.owner = parcelOnChainOwners[parcelId]
    }
  }

  return {
    isConnected: isConnected(state),
    isConnecting: isConnecting(state),
    authorization: getAuthorizations(state),
    auctionParams: getParams(state),
    wallet,
    allParcels
  }
}

const mapDispatch = dispatch => ({
  onShowAuctionModal: () => dispatch(openModal('AuctionModal')),
  onFetchAuctionParams: () => dispatch(fetchAuctionParamsRequest()),
  onSetParcelOnChainOwner: (parcelId, owner) =>
    dispatch(setParcelOnChainOwner(parcelId, owner)),
  onSubmit: (parcels, beneficiary) =>
    dispatch(bidOnParcelsRequest(parcels, beneficiary))
})

export default connect(mapState, mapDispatch)(AuctionPage)
