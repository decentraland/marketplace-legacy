import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { getMatchParamsCoordinates } from 'modules/location/selectors'
import { getPublications, isTxIdle } from 'modules/publication/selectors'
import { getWallet } from 'modules/wallet/selectors'
import { publishRequest } from 'modules/publication/actions'
import { findPublicationByCoordinates } from 'modules/publication/utils'
import { locations } from 'locations'

import PublishPage from './PublishPage'

const mapState = (state, ownProps) => {
  const { x, y } = getMatchParamsCoordinates(ownProps)
  const publications = getPublications(state)

  return {
    publication: findPublicationByCoordinates(publications, x, y),
    isTxIdle: isTxIdle(state),
    x,
    y,
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
