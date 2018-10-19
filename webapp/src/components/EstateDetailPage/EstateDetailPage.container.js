import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import { locations } from 'locations'
import { getMatchParams } from 'modules/location/selectors'
import { getData as getParcels } from 'modules/parcels/selectors'
import { getData as getPublications } from 'modules/publication/selectors'
import { navigateTo } from '@dapps/modules/location/actions'

import EstateDetailPage from './EstateDetailPage'

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
