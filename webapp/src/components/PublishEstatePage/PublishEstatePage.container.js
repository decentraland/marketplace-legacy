import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { ASSET_TYPES } from 'shared/asset'
import { locations } from 'locations'
import { getMatchParams } from 'modules/location/selectors'
import {
  getEstatePublicationById,
  isPublishingIdle
} from 'modules/publication/selectors'
import { getWallet, isConnecting } from 'modules/wallet/selectors'
import { publishRequest } from 'modules/publication/actions'
import PublishEstatePage from './PublishEstatePage'
import {
  getData as getAuthorizations,
  isLoading
} from 'modules/authorization/selectors'

const mapState = (state, ownProps) => {
  const { id } = getMatchParams(ownProps)
  const wallet = getWallet(state)

  let authorization

  if (wallet) {
    authorization = getAuthorizations(state)[wallet.address]
  }

  return {
    id,
    authorization,
    publication: getEstatePublicationById(state, id),
    isTxIdle: isPublishingIdle(state),
    isLoading: isConnecting(state) || isLoading(state)
  }
}

const mapDispatch = (dispatch, ownProps) => {
  const { id } = getMatchParams(ownProps)

  return {
    onPublish: publication =>
      dispatch(
        publishRequest({ ...publication, asset_type: ASSET_TYPES.estate })
      ),
    onCancel: () => dispatch(push(locations.estateDetail(id)))
  }
}

export default withRouter(connect(mapState, mapDispatch)(PublishEstatePage))
