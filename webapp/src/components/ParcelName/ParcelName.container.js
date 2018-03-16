import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import { getDistricts } from 'modules/districts/selectors'
import ParcelName from './ParcelName'

const mapState = (state, ownProps) => {
  return {
    districts: getDistricts(state)
  }
}

const mapDispatch = dispatch => ({})

export default withRouter(connect(mapState, mapDispatch)(ParcelName))
