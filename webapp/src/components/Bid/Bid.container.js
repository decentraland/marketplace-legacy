import { connect } from 'react-redux'
import { navigateTo } from '@dapps/modules/location/actions'

import { locations } from 'locations'
import { ASSET_TYPES } from 'shared/asset'
import { splitCoordinate } from 'shared/coordinates'
import { isOwner } from 'shared/roles'
import { getAsset } from 'modules/asset/selectors'
import { archiveBid, unarchiveBid } from 'modules/archivedBid/actions'
import { getData as getArchivedBids } from 'modules/archivedBid/selectors'
import { getWallet } from 'modules/wallet/selectors'
import Bid from './Bid'

const mapState = (state, { bid }) => {
  const wallet = getWallet(state)
  const archivedBids = getArchivedBids(state)

  const address = wallet ? wallet.address : null
  const asset = getAsset(state, bid.asset_id, bid.asset_type)

  return {
    address,
    asset,
    isOwner: isOwner(address, asset),
    isBidArchived: !!archivedBids[bid.id]
  }
}

const mapDispatch = (dispatch, { bid, isOwner }) => {
  const { id, asset_id, asset_type } = bid

  return {
    onArchive: bid => dispatch(archiveBid(bid)),
    onUnarchive: bid => dispatch(unarchiveBid(bid)),
    onConfirm: () =>
      dispatch(
        !isOwner || bid.seller === bid.bidder
          ? navigateTo(locations.cancelAssetBid(asset_id, asset_type))
          : navigateTo(locations.acceptAssetBid(asset_id, asset_type, id))
      ),
    onUpdate: () =>
      dispatch(navigateTo(locations.bidAsset(asset_id, asset_type)))
  }
}

export default connect(mapState, mapDispatch)(Bid)
