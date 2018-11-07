import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { locations } from 'locations'
import { getMatchParamsCoordinates } from 'modules/location/selectors'
import { isEditTransactionIdle } from 'modules/parcels/selectors'
import { editParcelRequest } from 'modules/parcels/actions'

import EditParcelPage from './EditParcelPage'

const mapState = (state, ownProps) => {
  const { x, y } = getMatchParamsCoordinates(ownProps)

  return {
    x,
    y,
    isTxIdle: isEditTransactionIdle(state)
  }
}

const mapDispatch = (dispatch, ownProps) => {
  const { x, y } = getMatchParamsCoordinates(ownProps)

  return {
    onSubmit: parcel => dispatch(editParcelRequest(parcel)),
    onCancel: () => dispatch(push(locations.parcelDetail(x, y)))
  }
}

export default withRouter(connect(mapState, mapDispatch)(EditParcelPage))
