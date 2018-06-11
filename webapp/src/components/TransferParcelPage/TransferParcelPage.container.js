import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { getPublications } from 'modules/publication/selectors'
import { isTxIdle, getError } from 'modules/transfer/selectors'
import { getMatchParamsCoordinates } from 'modules/location/selectors'
import { transferParcelRequest, cleanTransfer } from 'modules/transfer/actions'
import { locations } from 'locations'

import TransferParcelPage from './TransferParcelPage'

const mapState = (state, ownProps) => {
  const { x, y } = getMatchParamsCoordinates(ownProps)
  return {
    x,
    y,
    isTxIdle: isTxIdle(state),
    transferError: getError(state),
    publications: getPublications(state)
  }
}

const mapDispatch = (dispatch, ownProps) => {
  const { x, y } = getMatchParamsCoordinates(ownProps)
  return {
    onSubmit: (parcel, address) =>
      dispatch(transferParcelRequest(parcel, address)),
    onCancel: () => dispatch(push(locations.parcelDetail(x, y))),
    onCleanTransfer: () => dispatch(cleanTransfer())
  }
}

export default withRouter(connect(mapState, mapDispatch)(TransferParcelPage))
