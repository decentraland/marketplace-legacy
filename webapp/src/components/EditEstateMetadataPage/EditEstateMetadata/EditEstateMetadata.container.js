import { connect } from 'react-redux'

import { isEstateTransactionIdle } from 'modules/estates/selectors'
import EditEstateMetadata from './EditEstateMetadata'

const mapState = state => ({
  isTxIdle: isEstateTransactionIdle(state)
})

export default connect(mapState)(EditEstateMetadata)
