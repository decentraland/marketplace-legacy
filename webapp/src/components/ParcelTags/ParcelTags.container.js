import { connect } from 'react-redux'

import { getDistricts } from 'modules/districts/selectors'
import ParcelTags from './ParcelTags'

const mapState = (state, ownProps) => ({
  districts: getDistricts(state)
})

const mapDispatch = () => ({})

export default connect(mapState, mapDispatch)(ParcelTags)
