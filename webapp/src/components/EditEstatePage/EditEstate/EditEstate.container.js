import { connect } from 'react-redux'
import { goBack } from 'react-router-redux'

import EditState from './EditEstate'
import { getData as getParcels } from 'modules/parcels/selectors'
import { isEstateTransactionIdle } from 'modules/estates/selectors'
import {
  createEstateRequest,
  editEstateParcelsRequest,
  editEstateMetadataRequest
} from 'modules/estates/actions'

const mapState = state => ({
  allParcels: getParcels(state),
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
