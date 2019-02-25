import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { locations } from 'locations'
import { LISTING_TYPES } from 'shared/listing'
import { ASSET_TYPES } from 'shared/asset'
import { getMatchParamsCoordinates } from 'modules/location/selectors'
import {
  getPublicationByCoordinate,
  isPublishingIdle
} from 'modules/publication/selectors'
import { getWallet, isConnecting } from 'modules/wallet/selectors'
import { isLoading, getAuthorizations } from 'modules/authorization/selectors'
import { publishRequest } from 'modules/publication/actions'
import { openModal } from 'modules/ui/actions'
import PublishParcelPage from './PublishParcelPage'

const mapState = (state, ownProps) => {
  const { x, y } = getMatchParamsCoordinates(ownProps)
  const wallet = getWallet(state)

  let authorization

  if (wallet) {
    authorization = getAuthorizations(state)
  }

  return {
    x,
    y,
    authorization,
    isLoading: isConnecting(state) || isLoading(state),
    publication: getPublicationByCoordinate(state, x, y),
    isTxIdle: isPublishingIdle(state)
  }
}

const mapDispatch = (dispatch, ownProps) => {
  const { x, y } = getMatchParamsCoordinates(ownProps)

  return {
    onPublish: publication =>
      dispatch(
        openModal('FatfingerModal', {
          onSubmit: () =>
            dispatch(
              publishRequest({ ...publication, asset_type: ASSET_TYPES.parcel })
            ),
          assetType: ASSET_TYPES.parcel,
          priceToConfirm: publication.price,
          listingType: LISTING_TYPES.PUBLICATION
        })
      ),
    onCancel: () => dispatch(push(locations.parcelDetail(x, y)))
  }
}

export default withRouter(connect(mapState, mapDispatch)(PublishParcelPage))
