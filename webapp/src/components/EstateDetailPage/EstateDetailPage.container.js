import { connect } from 'react-redux'
import { navigateTo } from '@dapps/modules/location/actions'

import { locations } from 'locations'
import { getData as getAtlas } from 'modules/map/selectors'
import { getData as getPublications } from 'modules/publication/selectors'

import EstateDetailPage from './EstateDetailPage'

const mapState = (state, ownProps) => {
  return {
    estate: ownProps.asset,
    publications: getPublications(state),
    atlas: getAtlas(state)
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
      dispatch(navigateTo(locations.parcelDetail(parcel.x, parcel.y)))
  }
}

export default connect(mapState, mapDispatch)(EstateDetailPage)
