import { connect } from 'react-redux'
import { goBack } from 'react-router-redux'
import { withRouter } from 'react-router'

import DeleteEstatePage from './DeleteEstatePage'
import { getMatchParams } from 'modules/location/selectors'
import { deleteEstateRequest } from 'modules/estates/actions'
import { isEstateTransactionIdle } from 'modules/estates/selectors'

const mapState = (state, ownProps) => {
  const { id } = getMatchParams(ownProps)

  return {
    id,
    isTxIdle: isEstateTransactionIdle(state)
  }
}

const mapDispatch = (dispatch, ownProps) => {
  const { id } = getMatchParams(ownProps)

  return {
    onCancel: () => dispatch(goBack()),
    onConfirm: () => dispatch(deleteEstateRequest(id))
  }
}

export default withRouter(connect(mapState, mapDispatch)(DeleteEstatePage))
