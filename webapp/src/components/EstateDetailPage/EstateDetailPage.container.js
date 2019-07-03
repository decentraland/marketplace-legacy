import { connect } from 'react-redux'
import { navigateTo } from '@dapps/modules/location/actions'

import { locations } from 'locations'
import { ASSET_TYPES } from 'shared/asset'
import { getData as getTiles } from 'modules/tile/selectors'
import { navigateToAsset } from 'modules/asset/actions'
import { getData as getPublications } from 'modules/publication/selectors'
import { getWalletUnarchivedBidsByAsset } from 'modules/archivedBid/selectors'

import EstateDetailPage from './EstateDetailPage'

const mapState = (state, ownProps) => {
  const estate = ownProps.asset

  return {
    publications: getPublications(state),
    tiles: getTiles(state),
    bids: getWalletUnarchivedBidsByAsset(state, estate, ASSET_TYPES.estate),
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
    onParcelClick: parcel =>
      dispatch(navigateToAsset(parcel.id, ASSET_TYPES.parcel))
  }
}

export default connect(mapState, mapDispatch)(EstateDetailPage)
