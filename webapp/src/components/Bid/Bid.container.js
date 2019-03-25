import { connect } from 'react-redux'
import { navigateTo } from '@dapps/modules/location/actions'

import { locations } from 'locations'
import { ASSET_TYPES } from 'shared/asset'
import { splitCoordinate } from 'shared/coordinates'
import { archiveBid, unarchiveBid } from 'modules/archivedBid/actions'
import { getEstates } from 'modules/estates/selectors'
import { getData as getArchivedBids } from 'modules/archivedBid/selectors'
import { getWallet } from 'modules/wallet/selectors'

const mapState = (state, ownProps) => {
  const wallet = getWallet(state)
  const archivedBids = getArchivedBids(state)

  return {
    estates: getEstates(state),
    isBidArchived: !!archivedBids[ownProps.bid.id],
    address: wallet ? wallet.address : null
  }
}

const mapDispatch = (dispatch, ownProps) => {
  const { bid, isOwner } = ownProps
  const hasSameSellerAndBidder = bid.seller === bid.bidder

  let onConfirm
  let onUpdate

  switch (bid.asset_type) {
    case ASSET_TYPES.parcel: {
      const [x, y] = splitCoordinate(bid.asset_id)

      onConfirm = () =>
        dispatch(
          !isOwner || hasSameSellerAndBidder
            ? navigateTo(locations.cancelBidParcel(x, y))
            : navigateTo(locations.acceptBidParcel(x, y, bid.id))
        )

      onUpdate = () => dispatch(navigateTo(locations.bidParcel(x, y)))
      break
    }
    case ASSET_TYPES.estate: {
      const estateId = bid.asset_id
      onConfirm = () =>
        dispatch(
          !isOwner || hasSameSellerAndBidder
            ? navigateTo(locations.cancelBidEstate(estateId))
            : navigateTo(locations.acceptBidEstate(estateId, bid.id))
        )

      onUpdate = () => dispatch(navigateTo(locations.bidEstate(estateId)))
      break
    }
    default:
      break
  }
  return {
    onArchive: bid => dispatch(archiveBid(bid)),
    onUnarchive: bid => dispatch(unarchiveBid(bid)),
    onUpdate,
    onConfirm
  }
}

export default connect(mapState, mapDispatch)(Bid)
