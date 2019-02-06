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
import { isAssetBid } from 'shared/bid'
import { buildCoordinate } from 'shared/coordinates'
import {
  getMatchParams,
  getMatchParamsCoordinates
} from 'modules/location/selectors'
import { acceptBidRequest, fetchBidByIdRequest } from 'modules/bid/actions'
import { getData as getBids, isAcceptIdle } from 'modules/bid/selectors'
import { isLoading } from 'modules/authorization/selectors'
import AcceptBidAssetPage from './AcceptBidAssetPage'

const mapState = (state, ownProps) => {
  const { bidId, id } = getMatchParams(ownProps)
  let assetId

  switch (ownProps.assetType) {
    case ASSET_TYPES.parcel: {
      const { x, y } = getMatchParamsCoordinates(ownProps)
      assetId = buildCoordinate(x, y)
      break
    }
    case ASSET_TYPES.estate: {
      assetId = id
      break
    }
    default:
      break
  }

  const bids = getBids(state)
  const bid = bids[bidId]

  return {
    address: getAddress(state),
    isTxIdle: isAcceptIdle(state),
    bid: isAssetBid(bid, assetId, ownProps.assetType) ? bid : null,
    isLoading: isConnecting(state) || isLoading(state),
    isConnected: isConnected(state),
    id: assetId
  }
}

const mapDispatch = (dispatch, ownProps) => {
  const { bidId, id } = getMatchParams(ownProps)
  let onCancel

  switch (ownProps.assetType) {
    case ASSET_TYPES.parcel: {
      const { x, y } = getMatchParamsCoordinates(ownProps)
      onCancel = () => dispatch(push(locations.parcelDetail(x, y)))
      break
    }
    case ASSET_TYPES.estate: {
      onCancel = () => dispatch(push(locations.estateDetail(id)))
      break
    }
    default:
      break
  }
  return {
    onFetchBidById: () => dispatch(fetchBidByIdRequest(bidId)),
    onConfirm: bid => dispatch(acceptBidRequest(bid)),
    onCancel
  }
}

export default withRouter(connect(mapState, mapDispatch)(AcceptBidAssetPage))
