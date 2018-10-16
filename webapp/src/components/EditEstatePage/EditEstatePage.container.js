import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { getMatchParams } from 'modules/location/selectors'
import EditEstatePage from './EditEstatePage'

const mapState = (state, ownProps) => {
  const { id, x, y } = getMatchParams(ownProps)
  return {
    id,
    x: parseInt(x, 10),
    y: parseInt(y, 10)
  }
}

const mapDispatch = (dispatch, ownProps) => ({})

export default withRouter(connect(mapState, mapDispatch)(EditEstatePage))
