import { connect } from 'react-redux'
import { navigateTo } from '@dapps/modules/location/actions'

import { locations } from 'locations'
import { getData as getTiles } from 'modules/tile/selectors'
import { getData as getPublications } from 'modules/publication/selectors'
import { fetchAsset } from 'modules/asset/actions'
import { ASSET_TYPES } from 'shared/asset'

import EstateDetailPage from './EstateDetailPage'

const mapState = (state, ownProps) => {
  return {
    estate: ownProps.asset,
    publications: getPublications(state),
    tiles: getTiles(state)
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
