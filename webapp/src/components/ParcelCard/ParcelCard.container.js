import { connect } from 'react-redux'
import { getData as getPublications } from 'modules/publication/selectors'
import ParcelCard from './ParcelCard'

const mapState = state => ({
  publications: getPublications(state)
})

export default connect(mapState)(ParcelCard)
