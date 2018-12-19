import { connect } from 'react-redux'
import { isLoadingType } from '@dapps/modules/loading/selectors'

import { getWallet, isConnected, isConnecting } from 'modules/wallet/selectors'
import { getAuthorizations } from 'modules/authorization/selectors'
import { getData as getTiles } from 'modules/tile/selectors'
import {
  getParcelOnChainOwners,
  getParams,
  getCenter,
  getLoading,
  getSelectedToken,
  getRate,
  getSelectedCoordinatesById,
  getPrice
} from 'modules/auction/selectors'
import { getModal } from 'modules/ui/selectors'
import { openModal } from 'modules/ui/actions'
import {
  FETCH_AVAILABLE_PARCEL_REQUEST,
  fetchAvailableParcelRequest
} from 'modules/parcels/actions'
import {
  FETCH_AUCTION_RATE_REQUEST,
  FETCH_AUCTION_PRICE_REQUEST,
  fetchAuctionParamsRequest,
  fetchAuctionRateRequest,
  setParcelOnChainOwner,
  changeAuctionCenterParcel,
  purchaseAuctionParcels,
  setSelectedCoordinates,
  fetchAuctionPriceRequest
} from 'modules/auction/actions'
import AuctionPage from './AuctionPage'

const mapState = state => {
  const wallet = getWallet(state)

  const parcelOnChainOwners = getParcelOnChainOwners(state)
  const tiles = getTiles(state)

  // Side-effect!
  // This particular piece of code mutates the state adding more up to date owners.
  for (const parcelId in parcelOnChainOwners) {
    const tile = tiles[parcelId]
    if (!tile.owner) {
      tile.owner = parcelOnChainOwners[parcelId]
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
    price: getPrice(state),
    params: getParams(state),
    center: getCenter(state),
    modal: getModal(state),
    token: getSelectedToken(state),
    rate: getRate(state),
    selectedCoordinatesById: getSelectedCoordinatesById(state),
    isRefreshingPrice:
      isLoadingType(getLoading(state), FETCH_AUCTION_RATE_REQUEST) ||
      isLoadingType(getLoading(state), FETCH_AUCTION_PRICE_REQUEST),
    wallet,
    tiles,
    // this is not used on the AuctionPage, but since we mutate `tiles`,
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
    dispatch(purchaseAuctionParcels(parcels, beneficiary)),
  onChangeCoords: selectedCoordinatesById =>
    dispatch(setSelectedCoordinates(selectedCoordinatesById)),
  onFetchAuctionRate: token => dispatch(fetchAuctionRateRequest(token)),
  onFetchAuctionParams: () => dispatch(fetchAuctionParamsRequest()),
  onFetchAuctionPrice: () => dispatch(fetchAuctionPriceRequest())
})

export default connect(mapState, mapDispatch)(AuctionPage)
