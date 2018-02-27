import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { getParams } from 'modules/location/selectors'
import { getPublications, isTxIdle } from 'modules/publication/selectors'
import { publishRequest } from 'modules/publication/actions'
import { findPublicationByCoordinates } from 'modules/publication/utils'
import { locations } from 'locations'

import PublishPage from './PublishPage'

const mapState = (state, ownProps) => {
  const params = getParams(ownProps)
  const x = parseInt(params.x, 10)
  const y = parseInt(params.y, 10)
  const publications = getPublications(state)

  return {
    publication: findPublicationByCoordinates(publications, x, y),
    isTxIdle: isTxIdle(state),
    x,
    y
  }
}

const mapDispatch = (dispatch, ownProps) => {
  const params = getParams(ownProps)
  const x = parseInt(params.x, 10)
  const y = parseInt(params.y, 10)
  return {
    onPublish: publication => dispatch(publishRequest(publication)),
    onCancel: () => dispatch(push(locations.parcelDetail(x, y)))
  }
}

export default withRouter(connect(mapState, mapDispatch)(PublishPage))
