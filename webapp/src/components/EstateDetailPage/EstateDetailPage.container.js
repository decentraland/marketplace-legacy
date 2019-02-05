import { connect } from 'react-redux'
import { navigateTo } from '@dapps/modules/location/actions'

import { locations } from 'locations'
import { ASSET_TYPES } from 'shared/asset'
import { getData as getTiles } from 'modules/tile/selectors'
import { fetchAsset } from 'modules/asset/actions'
import { getData as getPublications } from 'modules/publication/selectors'
import { getBidsByAssetFactory } from 'modules/bid/selectors'

import EstateDetailPage from './EstateDetailPage'

const mapState = (state, ownProps) => {
  const getBids = getBidsByAssetFactory(
    ownProps.isOwner,
    ASSET_TYPES.estate,
    ownProps.asset.id
  )
  return {
    estate: ownProps.asset,
    publications: getPublications(state),
    tiles: getTiles(state),
    bids: getBids(state)
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
