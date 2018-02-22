import { connect } from 'react-redux'
import { getDistricts } from 'modules/districts/selectors'
import ParcelOwner from './ParcelOwner'

const mapState = (state, ownProps) => {
  return {
    districts: getDistricts(state)
  }
}

const mapDispatch = dispatch => ({})

export default connect(mapState, mapDispatch)(ParcelOwner)
