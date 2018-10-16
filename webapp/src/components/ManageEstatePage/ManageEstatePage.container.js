import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { isManageTransactionIdle } from 'modules/estates/selectors'
import { getMatchParams } from 'modules/location/selectors'
import { manageEstateRequest } from 'modules/estates/actions'
import { locations } from 'locations'
import ManageEstatePage from './ManageEstatePage'

const mapState = (state, ownProps) => {
  const { id } = getMatchParams(ownProps)
  return {
    id,
    isTxIdle: isManageTransactionIdle(state)
  }
}

const mapDispatch = (dispatch, ownProps) => {
  const { id } = getMatchParams(ownProps)

  return {
    onSubmit: (estate, address, revoked) =>
      dispatch(manageEstateRequest(estate, address, revoked)),
    onCancel: () => dispatch(push(locations.estateDetail(id)))
  }
}

export default withRouter(connect(mapState, mapDispatch)(ManageEstatePage))
