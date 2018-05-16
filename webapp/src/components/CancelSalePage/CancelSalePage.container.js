import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { getMatchParamsCoordinates } from 'modules/location/selectors'
import { getPublications, getLoading } from 'modules/publication/selectors'
import { findPublicationByCoordinates } from 'modules/publication/utils'
import { isLoadingType } from 'modules/loading/selectors'
import {
  CANCEL_SALE_REQUEST,
  cancelSaleRequest
} from 'modules/publication/actions'
import { locations } from 'locations'

import CancelSalePage from './CancelSalePage'

const mapState = (state, ownProps) => {
  const { x, y } = getMatchParamsCoordinates(ownProps)
  const publications = getPublications(state)

  return {
    publication: findPublicationByCoordinates(publications, x, y),
    x,
    y,
    isDisabled: isLoadingType(getLoading(state), CANCEL_SALE_REQUEST)
  }
}

const mapDispatch = (dispatch, ownProps) => {
  const { x, y } = getMatchParamsCoordinates(ownProps)
  return {
    onConfirm: publication => dispatch(cancelSaleRequest(publication)),
    onCancel: () => dispatch(push(locations.parcelDetail(x, y)))
  }
}

export default withRouter(connect(mapState, mapDispatch)(CancelSalePage))
