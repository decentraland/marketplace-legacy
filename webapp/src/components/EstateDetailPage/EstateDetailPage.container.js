import { connect } from 'react-redux'
import { navigateTo } from '@dapps/modules/location/actions'

import { locations } from 'locations'
import { ASSET_TYPES } from 'shared/asset'
import { getData as getArchivedBids } from 'modules/archivedBid/selectors'
import { getData as getTiles } from 'modules/tile/selectors'
import { fetchAsset } from 'modules/asset/actions'
import { getData as getPublications } from 'modules/publication/selectors'
import { getWalletBidsByAsset } from 'modules/bid/selectors'

import EstateDetailPage from './EstateDetailPage'

const mapState = (state, ownProps) => {
  const estate = ownProps.asset
  const bids = getWalletBidsByAsset(state, estate, ASSET_TYPES.estate)
  const archivedBids = getArchivedBids(state)

  return {
    publications: getPublications(state),
    tiles: getTiles(state),
    bids: bids.filter(bid => !archivedBids[bid.id]),
    estate
  }
}

const mapDispatch = (dispatch, ownProps) => {
  const id = ownProps.asset.id

  return {
    onEditParcels: () => dispatch(navigateTo(locations.editEstateParcels(id))),
    onEditMetadata: () =>
      dispatch(navigateTo(locations.editEstateMetadata(id))),
    onManageEstate: () => dispatch(navigateTo(locations.manageEstate(id))),
    onParcelClick: parcel => dispatch(fetchAsset(parcel, ASSET_TYPES.parcel))
  }
}

export default connect(mapState, mapDispatch)(EstateDetailPage)
