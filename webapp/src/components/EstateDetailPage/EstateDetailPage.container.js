import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import { locations } from 'locations'
import { navigateTo } from 'modules/location/actions'
import { getMatchParams } from 'modules/location/selectors'
import EstateDetailPage from 'components/EstateDetailPage/EstateDetailPage'
import { getData as getParcels } from 'modules/parcels/selectors'
import { getData as getPublications } from 'modules/publication/selectors'

const mapState = (state, ownProps) => {
  const { id } = getMatchParams(ownProps)

  return {
    id,
    publications: getPublications(state),
    allParcels: getParcels(state)
  }
}

const mapDispatch = (dispatch, ownProps) => {
  const { id } = getMatchParams(ownProps)

  return {
    onEditParcels: () => dispatch(navigateTo(locations.editEstateParcels(id))),
    onEditMetadata: () =>
      dispatch(navigateTo(locations.editEstateMetadata(id))),
    onManageEstate: () => dispatch(navigateTo(locations.manageEstate(id)))
  }
}

export default withRouter(connect(mapState, mapDispatch)(EstateDetailPage))
