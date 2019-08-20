import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { goBack } from 'react-router-redux'

import {
  createEstateRequest,
  editEstateParcelsRequest,
  editEstateMetadataRequest
} from 'modules/estates/actions'
import { getMatchParams } from 'modules/location/selectors'
import { getWallet } from 'modules/wallet/selectors'
import EditEstatePage from './EditEstatePage'

const mapState = (state, ownProps) => {
  const { id, x, y } = getMatchParams(ownProps)

  return {
    id,
    x: parseInt(x, 10),
    y: parseInt(y, 10),
    wallet: getWallet(state)
  }
}

const mapDispatch = dispatch => ({
  onEditEstateParcels: estate => dispatch(editEstateParcelsRequest(estate)),
  onCreateEstate: estate => dispatch(createEstateRequest(estate)),
  onEditEstateMetadata: estate => dispatch(editEstateMetadataRequest(estate)),
  onCancel: () => dispatch(goBack())
})

export default withRouter(connect(mapState, mapDispatch)(EditEstatePage))
