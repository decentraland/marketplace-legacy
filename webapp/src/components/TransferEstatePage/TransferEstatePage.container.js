import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { isTransferIdle } from 'modules/estates/selectors'
import { getMatchParams } from 'modules/location/selectors'
import { transferEstateRequest } from 'modules/estates/actions'
import { locations } from 'locations'

import TransferEstatePage from './TransferEstatePage'

const mapState = (state, ownProps) => {
  const { id } = getMatchParams(ownProps)

  return {
    id,
    isTxIdle: isTransferIdle(state)
  }
}

const mapDispatch = (dispatch, ownProps) => {
  const { id } = getMatchParams(ownProps)

  return {
    onSubmit: (estate, address) =>
      dispatch(transferEstateRequest(estate, address)),
    onCancel: () => dispatch(push(locations.estateDetail(id)))
  }
}

export default withRouter(connect(mapState, mapDispatch)(TransferEstatePage))
