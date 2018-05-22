import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { locations } from 'locations'

import { getMatchParams } from 'modules/location/selectors'
import { navigateTo } from 'modules/location/actions'
import { createEstateRequest } from 'modules/estates/actions'
import { getError, isLoading } from 'modules/parcels/selectors'
import CreateEstatePage from './CreateEstatePage'

const mapState = (state, ownProps) => {
  const { x, y } = getMatchParams(ownProps)
  return {
    x,
    y,
    isLoading: isLoading(state),
    error: getError(state)
  }
}

const mapDispatch = (dispatch, ownProps) => {
  const { x, y } = getMatchParams(ownProps)
  return {
    onError: error => dispatch(navigateTo(locations.root)),
    onCancel: () => dispatch(navigateTo(locations.parcelDetail(x, y))),
    createEstate: estate => dispatch(createEstateRequest(estate))
  }
}

export default withRouter(connect(mapState, mapDispatch)(CreateEstatePage))
