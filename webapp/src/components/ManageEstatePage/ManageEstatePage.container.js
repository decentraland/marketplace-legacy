import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { locations } from 'locations'
import { isManageTransactionIdle } from 'modules/estates/selectors'
import { getMatchParams } from 'modules/location/selectors'
import { manageAssetRequest } from 'modules/management/actions'
import { ASSET_TYPES } from 'shared/asset'

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
      dispatch(
        manageAssetRequest(estate, ASSET_TYPES.estate, address, revoked)
      ),
    onCancel: () => dispatch(push(locations.estateDetail(id)))
  }
}

export default withRouter(connect(mapState, mapDispatch)(ManageEstatePage))
