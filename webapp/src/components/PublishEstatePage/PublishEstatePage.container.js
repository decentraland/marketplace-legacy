import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { locations } from 'locations'
import { getMatchParams } from 'modules/location/selectors'
import {
  getEstatePublicationById,
  isPublishingIdle
} from 'modules/publication/selectors'
import { getWallet, isConnecting } from 'modules/wallet/selectors'
import { isLoading, getAuthorizations } from 'modules/authorization/selectors'
import { publishRequest } from 'modules/publication/actions'
import { openModal } from 'modules/ui/actions'
import { ASSET_TYPES } from 'shared/asset'

import PublishEstatePage from './PublishEstatePage'

const mapState = (state, ownProps) => {
  const { id } = getMatchParams(ownProps)
  const wallet = getWallet(state)

  let authorization

  if (wallet) {
    authorization = getAuthorizations(state)
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
        openModal('FatfingerModal', {
          onSubmit: () =>
            dispatch(
              publishRequest({ ...publication, asset_type: ASSET_TYPES.estate })
            ),
          assetType: ASSET_TYPES.estate,
          priceToConfirm: publication.price
        })
      ),
    onCancel: () => dispatch(push(locations.estateDetail(id)))
  }
}

export default withRouter(connect(mapState, mapDispatch)(PublishEstatePage))
