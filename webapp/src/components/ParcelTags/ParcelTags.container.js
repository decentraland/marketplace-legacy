import { connect } from 'react-redux'

import { getDistricts } from 'modules/districts/selectors'
import ParcelTags from './ParcelTags'
import { getEstates } from 'modules/estates/selectors'

const mapState = (state, ownProps) => ({
  districts: getDistricts(state),
  estate: ownProps.estate ? getEstates(state)[ownProps.estate.token_id] : null
})

const mapDispatch = () => ({})

export default connect(mapState, mapDispatch)(ParcelTags)
