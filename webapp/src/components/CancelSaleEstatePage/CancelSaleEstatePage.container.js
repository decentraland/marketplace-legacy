import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { locations } from 'locations'
import { getMatchParams } from 'modules/location/selectors'
import {
  getEstatePublicationById,
  isCancelIdle
} from 'modules/publication/selectors'
import { cancelSaleRequest } from 'modules/publication/actions'
import CancelSaleEstatePage from './CancelSaleEstatePage'

const mapState = (state, ownProps) => {
  const { id } = getMatchParams(ownProps)
  return {
    id,
    isTxIdle: isCancelIdle(state),
    publication: getEstatePublicationById(state, id)
  }
}

const mapDispatch = (dispatch, ownProps) => {
  const { id } = getMatchParams(ownProps)

  return {
    onConfirm: publication => dispatch(cancelSaleRequest(publication)),
    onCancel: () => dispatch(push(locations.estateDetail(id)))
  }
}

export default withRouter(connect(mapState, mapDispatch)(CancelSaleEstatePage))
