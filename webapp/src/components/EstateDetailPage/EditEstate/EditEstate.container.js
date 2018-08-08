import { connect } from 'react-redux'

import EditState from './EditEstate'
import { getData as getParcels } from 'modules/parcels/selectors'
import { isEditingOrCreatingMetadataEstateTransactionIdle } from 'modules/estates/selectors'

const mapState = state => ({
  allParcels: getParcels(state),
  isTxIdle: isEditingOrCreatingMetadataEstateTransactionIdle(state)
})

export default connect(mapState)(EditState)
