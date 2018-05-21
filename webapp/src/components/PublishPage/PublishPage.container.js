import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { locations } from 'locations'
import { getMatchParamsCoordinates } from 'modules/location/selectors'
import {
  getPublicationByCoordinate,
  isTxIdle
} from 'modules/publication/selectors'
import { getWallet } from 'modules/wallet/selectors'
import { publishRequest } from 'modules/publication/actions'

import PublishPage from './PublishPage'

const mapState = (state, ownProps) => {
  const { x, y } = getMatchParamsCoordinates(ownProps)

  return {
    x,
    y,
    publication: getPublicationByCoordinate(state, x, y),
    isTxIdle: isTxIdle(state),
    wallet: getWallet(state)
  }
}

const mapDispatch = (dispatch, ownProps) => {
  const { x, y } = getMatchParamsCoordinates(ownProps)
  return {
    onPublish: publication => dispatch(publishRequest(publication)),
    onCancel: () => dispatch(push(locations.parcelDetail(x, y)))
  }
}

export default withRouter(connect(mapState, mapDispatch)(PublishPage))
