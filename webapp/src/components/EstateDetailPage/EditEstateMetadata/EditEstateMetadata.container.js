import { connect } from 'react-redux'

import EditEstateMetadata from './EditEstateMetadata'
import { isEstateTransactionIdle } from 'modules/estates/selectors'

const mapState = state => ({
  isTxIdle: isEstateTransactionIdle(state)
})

export default connect(mapState)(EditEstateMetadata)
