import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { goBack } from 'react-router-redux'

import { ASSET_TYPES } from 'shared/asset'
import { buildCoordinate } from 'shared/coordinates'
import { bidRequest } from 'modules/bid/actions'
import { openModal } from 'modules/ui/actions'
import {
  getMatchParams,
  getMatchParamsCoordinates
} from 'modules/location/selectors'
import { getWallet, isConnected, isConnecting } from 'modules/wallet/selectors'
import { isLoading, getAuthorizations } from 'modules/authorization/selectors'
import { isBidIdle, getBidByAssetIdFactory } from 'modules/bid/selectors'
import BidAssetPage from './BidAssetPage'

const mapState = (state, ownProps) => {
  let assetId
  switch (ownProps.assetType) {
    case ASSET_TYPES.parcel: {
      const { x, y } = getMatchParamsCoordinates(ownProps)
      assetId = buildCoordinate(x, y)
      break
    }
    case ASSET_TYPES.estate: {
      const { id } = getMatchParams(ownProps)
      assetId = id
      break
    }
    default:
      break
  }

  const getBidByAssetId = getBidByAssetIdFactory(assetId, ownProps.assetType)

  return state => {
    const wallet = getWallet(state)

    let authorization

    if (wallet) {
      authorization = getAuthorizations(state)
    }

    return {
      wallet,
      authorization,
      id: assetId,
      bid: getBidByAssetId(state),
      assetType: ownProps.assetType,
      isTxIdle: isBidIdle(state),
      isConnected: isConnected(state),
      isLoading: isConnecting(state) || isLoading(state)
    }
  }
}

const mapDispatch = (dispatch, ownProps) => {
  let onBid

  switch (ownProps.assetType) {
    case ASSET_TYPES.parcel: {
      onBid = bid =>
        dispatch(
          openModal('FatfingerModal', {
            onSubmit: () =>
              dispatch(bidRequest({ ...bid, asset_type: ASSET_TYPES.parcel })),
            assetType: ASSET_TYPES.parcel,
            priceToConfirm: bid.price
          })
        )
      break
    }
    case ASSET_TYPES.estate: {
      onBid = bid =>
        dispatch(
          openModal('FatfingerModal', {
            onSubmit: () =>
              dispatch(bidRequest({ ...bid, asset_type: ASSET_TYPES.estate })),
            assetType: ASSET_TYPES.estate,
            priceToConfirm: bid.price
          })
        )
      break
    }
    default:
      break
  }
  return {
    onCancel: () => dispatch(goBack()),
    onBid
  }
}

export default withRouter(connect(mapState, mapDispatch)(BidAssetPage))
