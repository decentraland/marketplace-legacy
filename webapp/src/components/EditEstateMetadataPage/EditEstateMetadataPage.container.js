import { connect } from 'react-redux'
import { goBack } from 'react-router-redux'

import { editEstateMetadataRequest } from 'modules/estates/actions'
import { getMatchParams } from 'modules/location/selectors'
import EditEstateMetadataPage from './EditEstateMetadataPage'

const mapState = (_, ownProps) => {
  const { id } = getMatchParams(ownProps)
  return { id }
}

const mapDispatch = dispatch => ({
  onSubmit: estate => dispatch(editEstateMetadataRequest(estate)),
  onCancel: () => dispatch(goBack())
})

export default connect(mapState, mapDispatch)(EditEstateMetadataPage)
