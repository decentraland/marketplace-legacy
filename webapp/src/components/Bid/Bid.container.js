import { connect } from 'react-redux'
import { navigateTo } from '@dapps/modules/location/actions'

import { locations } from 'locations'
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

const mapDispatch = dispatch => ({
  onArchive: bid => dispatch(archiveBid(bid)),
  onUnarchive: bid => dispatch(unarchiveBid(bid)),
  onAccept: bid =>
    dispatch(
      navigateTo(locations.acceptAssetBid(bid.asset_id, bid.asset_type, bid.id))
    ),
  onCancel: bid =>
    dispatch(
      navigateTo(locations.cancelAssetBid(bid.asset_id, bid.asset_type))
    ),
  onUpdate: bid =>
    dispatch(navigateTo(locations.bidAsset(bid.asset_id, bid.asset_type)))
})

export default connect(mapState, mapDispatch)(Bid)
