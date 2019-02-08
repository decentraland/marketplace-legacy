import { connect } from 'react-redux'
import { goBack } from 'react-router-redux'

import {
  createEstateRequest,
  editEstateParcelsRequest,
  editEstateMetadataRequest
} from 'modules/estates/actions'
import { isEstateTransactionIdle } from 'modules/estates/selectors'
import EditState from './EditEstate'

const mapState = state => ({
  isTxIdle: isEstateTransactionIdle(state)
})

const mapDispatch = dispatch => {
  return {
    onEditEstateParcels: estate => dispatch(editEstateParcelsRequest(estate)),
    onCreateEstate: estate => dispatch(createEstateRequest(estate)),
    onEditEstateMetadata: estate => dispatch(editEstateMetadataRequest(estate)),
    onCancel: () => dispatch(goBack())
  }
}

export default connect(mapState, mapDispatch)(EditState)
