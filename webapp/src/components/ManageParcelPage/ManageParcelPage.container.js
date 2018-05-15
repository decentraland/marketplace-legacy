import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { isManageTransactionIdle } from 'modules/parcels/selectors'
import { getMatchParamsCoordinates } from 'modules/location/selectors'
import { manageParcelRequest } from 'modules/parcels/actions'
import { locations } from 'locations'

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
    onSubmit: (parcel, address) =>
      dispatch(manageParcelRequest(parcel, address)),
    onCancel: () => dispatch(push(locations.parcelDetail(x, y)))
  }
}

export default withRouter(connect(mapState, mapDispatch)(ManageParcelPage))
