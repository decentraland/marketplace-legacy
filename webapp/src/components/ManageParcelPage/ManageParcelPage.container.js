import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { locations } from 'locations'
import { isManageTransactionIdle } from 'modules/parcels/selectors'
import { getMatchParamsCoordinates } from 'modules/location/selectors'
import { manageAssetRequest } from 'modules/management/actions'
import { ASSET_TYPES } from 'shared/asset'

import ManageParcelPage from './ManageParcelPage'

const mapState = (state, ownProps) => {
  const { x, y } = getMatchParamsCoordinates(ownProps)

  return {
    x,
    y,
    isTxIdle: isManageTransactionIdle(state)
  }
}

const mapDispatch = (dispatch, ownProps) => {
  const { x, y } = getMatchParamsCoordinates(ownProps)

  return {
    onSubmit: (parcel, address, revoked) =>
      dispatch(
        manageAssetRequest(parcel, ASSET_TYPES.parcel, address, revoked)
      ),
    onCancel: () => dispatch(push(locations.parcelDetail(x, y)))
  }
}

export default withRouter(connect(mapState, mapDispatch)(ManageParcelPage))
