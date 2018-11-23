import { connect } from 'react-redux'
import { isLoadingType } from '@dapps/modules/loading/selectors'

import { getWallet, isConnected, isConnecting } from 'modules/wallet/selectors'
import { getAuthorizations } from 'modules/authorization/selectors'
import { getData as getParcels } from 'modules/parcels/selectors'
import {
  getParcelOnChainOwners,
  getParams,
  getCenter,
  getLoading,
  getSelectedToken,
  getRate
} from 'modules/auction/selectors'
import { getModal } from 'modules/ui/selectors'
import { openModal } from 'modules/ui/actions'
import {
  FETCH_AVAILABLE_PARCEL_REQUEST,
  fetchAvailableParcelRequest
} from 'modules/parcels/actions'
import {
  fetchAuctionParamsRequest,
  fetchAuctionRateRequest,
  setParcelOnChainOwner,
  changeAuctionCenterParcel
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
    wallet,
    allParcels
  }
}

const mapDispatch = dispatch => ({
  onShowAuctionModal: () => dispatch(openModal('AuctionModal')),
  onFetchAuctionParams: () => dispatch(fetchAuctionParamsRequest()),
  onSetParcelOnChainOwner: (parcelId, owner) =>
    dispatch(setParcelOnChainOwner(parcelId, owner)),
  onFetchAvailableParcel: () => dispatch(fetchAvailableParcelRequest()),
  onChangeAuctionCenterParcel: parcel =>
    dispatch(changeAuctionCenterParcel(parcel)),
  onSubmit: (parcels, beneficiary) =>
    dispatch(openModal('BidConfirmationModal', { parcels, beneficiary })),
  onChangeToken: token => dispatch(fetchAuctionRateRequest(token))
})

export default connect(mapState, mapDispatch)(AuctionPage)
