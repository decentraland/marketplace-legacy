import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { getData as getPublications } from 'modules/publication/selectors'
import { isTransferIdle } from 'modules/parcels/selectors'
import { getMatchParamsCoordinates } from 'modules/location/selectors'
import { transferParcelRequest } from 'modules/parcels/actions'
import { locations } from 'locations'

import TransferParcelPage from './TransferParcelPage'

const mapState = (state, ownProps) => {
  const { x, y } = getMatchParamsCoordinates(ownProps)

  return {
    x,
    y,
    isTxIdle: isTransferIdle(state),
    publications: getPublications(state)
  }
}

const mapDispatch = (dispatch, ownProps) => {
  const { x, y } = getMatchParamsCoordinates(ownProps)

  return {
    onSubmit: (parcel, address) =>
      dispatch(transferParcelRequest(parcel, address)),
    onCancel: () => dispatch(push(locations.parcelDetail(x, y)))
  }
}

export default withRouter(connect(mapState, mapDispatch)(TransferParcelPage))
