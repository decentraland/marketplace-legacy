import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { locations } from 'locations'
import { getMatchParams } from 'modules/location/selectors'
import {
  getPublicationByAssetId,
  isPublishingIdle
} from 'modules/publication/selectors'
import { getWallet } from 'modules/wallet/selectors'
import { publishRequest } from 'modules/publication/actions'

import PublishEstatePage from './PublishEstatePage'

const mapState = (state, ownProps) => {
  const { id } = getMatchParams(ownProps)
  return {
    id,
    publication: getPublicationByAssetId(state, id),
    isTxIdle: isPublishingIdle(state),
    wallet: getWallet(state)
  }
}

const mapDispatch = (dispatch, ownProps) => {
  const { id } = getMatchParams(ownProps)

  return {
    onPublish: publication => dispatch(publishRequest(publication)),
    onCancel: () => dispatch(push(locations.estateDetail(id)))
  }
}

export default withRouter(connect(mapState, mapDispatch)(PublishEstatePage))
