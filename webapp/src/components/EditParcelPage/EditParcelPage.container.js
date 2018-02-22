import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { getParams } from 'modules/location/selectors'
import { editParcelRequest } from 'modules/parcels/actions'
import { locations } from 'locations'

import EditParcelPage from './EditParcelPage'

const mapState = (state, ownProps) => {
  const params = getParams(ownProps)
  const x = parseInt(params.x, 10)
  const y = parseInt(params.y, 10)
  return {
    x,
    y
  }
}

const mapDispatch = (dispatch, ownProps) => {
  const params = getParams(ownProps)
  const x = parseInt(params.x, 10)
  const y = parseInt(params.y, 10)
  return {
    onSubmit: parcel => dispatch(editParcelRequest(parcel)),
    onCancel: () => dispatch(push(locations.parcelDetail(x, y)))
  }
}

export default withRouter(connect(mapState, mapDispatch)(EditParcelPage))
