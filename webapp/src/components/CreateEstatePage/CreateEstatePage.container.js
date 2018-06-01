import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import { getMatchParams } from 'modules/location/selectors'
import { createEstateRequest } from 'modules/estates/actions'
import CreateEstatePage from './CreateEstatePage'

const mapState = (state, ownProps) => {
  const { x, y } = getMatchParams(ownProps)
  return {
    x,
    y
  }
}

const mapDispatch = (dispatch, ownProps) => {
  return {
    createEstate: estate => dispatch(createEstateRequest(estate))
  }
}

export default withRouter(connect(mapState, mapDispatch)(CreateEstatePage))
