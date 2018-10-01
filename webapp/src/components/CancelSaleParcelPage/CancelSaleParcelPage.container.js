import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { locations } from 'locations'
import { getMatchParamsCoordinates } from 'modules/location/selectors'
import {
  getPublicationByCoordinate,
  isCancelIdle
} from 'modules/publication/selectors'
import { cancelSaleRequest } from 'modules/publication/actions'

import CancelSaleParcelPage from './CancelSaleParcelPage'

const mapState = (state, ownProps) => {
  const { x, y } = getMatchParamsCoordinates(ownProps)

  return {
    x,
    y,
    isTxIdle: isCancelIdle(state),
    publication: getPublicationByCoordinate(state, x, y)
  }
}

const mapDispatch = (dispatch, ownProps) => {
  const { x, y } = getMatchParamsCoordinates(ownProps)

  return {
    onConfirm: publication => dispatch(cancelSaleRequest(publication)),
    onCancel: () => dispatch(push(locations.parcelDetail(x, y)))
  }
}

export default withRouter(connect(mapState, mapDispatch)(CancelSaleParcelPage))
