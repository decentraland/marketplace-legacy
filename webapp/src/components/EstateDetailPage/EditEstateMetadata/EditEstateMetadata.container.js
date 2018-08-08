import { connect } from 'react-redux'

import EditEstateMetadata from './EditEstateMetadata'
import { isEditingOrCreatingMetadataEstateTransactionIdle } from 'modules/estates/selectors'

const mapState = state => ({
  isTxIdle: isEditingOrCreatingMetadataEstateTransactionIdle(state)
})

export default connect(mapState)(EditEstateMetadata)
