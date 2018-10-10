import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import { locations } from 'locations'
import { navigateTo } from 'modules/location/actions'
import { getMatchParams } from 'modules/location/selectors'
import EstateDetailPage from 'components/EstateDetailPage/EstateDetailPage'
import { getData as getParcels } from 'modules/parcels/selectors'
import { getData as getPublications } from 'modules/publication/selectors'

const mapState = (state, ownProps) => {
  const { id, x, y } = getMatchParams(ownProps)

  return {
    id,
    publications: getPublications(state),
    x: parseInt(x, 10),
    y: parseInt(y, 10),
    allParcels: getParcels(state)
  }
}

const mapDispatch = (dispatch, ownProps) => {
  const { id } = getMatchParams(ownProps)

  return {
    onViewAssetClick: asset =>
      dispatch(navigateTo(locations.assetDetail(asset))),
    onEditParcels: () => dispatch(navigateTo(locations.editEstateParcels(id))),
    onEditMetadata: () => dispatch(navigateTo(locations.editEstateMetadata(id)))
  }
}

export default withRouter(connect(mapState, mapDispatch)(EstateDetailPage))
