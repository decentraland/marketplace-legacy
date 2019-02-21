import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { goBack } from 'react-router-redux'
import {
  getAddress,
  isConnected,
  isConnecting
} from '@dapps/modules/wallet/selectors'

import { ASSET_TYPES } from 'shared/asset'
import { isAssetBid } from 'shared/bid'
import { buildCoordinate } from 'shared/coordinates'
import {
  getMatchParams,
  getMatchParamsCoordinates
} from 'modules/location/selectors'
import { acceptBidRequest, fetchBidByIdRequest } from 'modules/bid/actions'
import {
  getData as getBids,
  isAcceptIdle,
  isFetchingBids
} from 'modules/bid/selectors'
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
    isBidLoading: isFetchingBids(state),
    isConnected: isConnected(state),
    id: assetId
  }
}

const mapDispatch = (dispatch, ownProps) => {
  const { bidId } = getMatchParams(ownProps)

  return {
    onFetchBidById: () => dispatch(fetchBidByIdRequest(bidId)),
    onConfirm: bid => dispatch(acceptBidRequest(bid)),
    onCancel: () => dispatch(goBack())
  }
}

export default withRouter(connect(mapState, mapDispatch)(AcceptBidAssetPage))
