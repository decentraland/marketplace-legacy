import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import {
  getAddress,
  isConnected,
  isConnecting
} from '@dapps/modules/wallet/selectors'

import { locations } from 'locations'
import { ASSET_TYPES } from 'shared/asset'
import { buildCoordinate } from 'shared/coordinates'
import { LISTING_STATUS } from 'shared/listing'
import {
  getMatchParams,
  getMatchParamsCoordinates
} from 'modules/location/selectors'
import { cancelBidRequest, fetchBidByAssetRequest } from 'modules/bid/actions'
import { getBidByAssetIdFactory, isCancelIdle } from 'modules/bid/selectors'
import { isLoading } from 'modules/authorization/selectors'
import CancelBidAssetPage from './CancelBidAssetPage'

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

  return state => ({
    address: getAddress(state),
    isTxIdle: isCancelIdle(state),
    bid: getBidByAssetId(state),
    isLoading: isConnecting(state) || isLoading(state),
    isConnected: isConnected(state),
    id: assetId
  })
}

const mapDispatch = (dispatch, ownProps) => {
  let onCancel
  let assetId

  switch (ownProps.assetType) {
    case ASSET_TYPES.parcel: {
      const { x, y } = getMatchParamsCoordinates(ownProps)
      onCancel = () => dispatch(push(locations.parcelDetail(x, y)))
      assetId = buildCoordinate(x, y)
      break
    }
    case ASSET_TYPES.estate: {
      const { id } = getMatchParams(ownProps)
      onCancel = () => dispatch(push(locations.estateDetail(id)))
      assetId = id
      break
    }
    default:
      break
  }
  return {
    onFetchBidByAsset: () =>
      dispatch(
        fetchBidByAssetRequest(assetId, ownProps.assetType, LISTING_STATUS.open)
      ),
    onConfirm: bid => dispatch(cancelBidRequest(bid)),
    onCancel
  }
}

export default withRouter(connect(mapState, mapDispatch)(CancelBidAssetPage))
