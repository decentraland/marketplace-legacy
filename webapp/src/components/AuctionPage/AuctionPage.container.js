import { connect } from 'react-redux'
import { isLoadingType } from '@dapps/modules/loading/selectors'

import { getWallet, isConnected, isConnecting } from 'modules/wallet/selectors'
import { getAuthorizations } from 'modules/authorization/selectors'
import { getData as getAtlas } from 'modules/map/selectors'
import {
  getParcelOnChainOwners,
  getParams,
  getCenter,
  getLoading,
  getSelectedToken,
  getRate,
  getSelectedCoordinatesById
} from 'modules/auction/selectors'
import { getModal } from 'modules/ui/selectors'
import { openModal } from 'modules/ui/actions'
import {
  FETCH_AVAILABLE_PARCEL_REQUEST,
  fetchAvailableParcelRequest
} from 'modules/parcels/actions'
import {
  fetchAuctionRateRequest,
  setParcelOnChainOwner,
  changeAuctionCenterParcel,
  setSelectedCoordinates
} from 'modules/auction/actions'
import AuctionPage from './AuctionPage'

const mapState = state => {
  const wallet = getWallet(state)

  const parcelOnChainOwners = getParcelOnChainOwners(state)
  const atlas = getAtlas(state)

  // Side-effect!
  // This particular piece of code mutates the state adding more up to date owners.
  for (const parcelId in parcelOnChainOwners) {
    const atlasLocation = atlas[parcelId]
    if (!atlasLocation.owner) {
      atlasLocation.owner = parcelOnChainOwners[parcelId]
    }
  }

  return {
    isConnected: isConnected(state),
    isConnecting: isConnecting(state),
    isAvailableParcelLoading: isLoadingType(
      getLoading(state),
      FETCH_AVAILABLE_PARCEL_REQUEST
    ),
    authorization: getAuthorizations(state),
    params: getParams(state),
    center: getCenter(state),
    modal: getModal(state),
    token: getSelectedToken(state),
    rate: getRate(state),
    selectedCoordinatesById: getSelectedCoordinatesById(state),
    wallet,
    atlas,
    // this is not used on the AuctionPage, but since we mutate `atlas`,
    // we pass this down to for a re-render down the tree
    parcelOnChainOwners
  }
}

const mapDispatch = dispatch => ({
  onShowAuctionModal: () => dispatch(openModal('AuctionModal')),
  onSetParcelOnChainOwner: (parcelId, owner) =>
    dispatch(setParcelOnChainOwner(parcelId, owner)),
  onFetchAvailableParcel: () => dispatch(fetchAvailableParcelRequest()),
  onChangeAuctionCenterParcel: parcel =>
    dispatch(changeAuctionCenterParcel(parcel)),
  onSubmit: (parcels, beneficiary) =>
    dispatch(openModal('BidConfirmationModal', { parcels, beneficiary })),
  onChangeToken: token => dispatch(fetchAuctionRateRequest(token)),
  onChangeCoords: selectedCoordinatesById =>
    dispatch(setSelectedCoordinates(selectedCoordinatesById))
})

export default connect(mapState, mapDispatch)(AuctionPage)
