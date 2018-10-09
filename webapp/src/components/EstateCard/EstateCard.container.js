import { connect } from 'react-redux'
import { getData as getPublications } from 'modules/publication/selectors'
import EstateCard from './EstateCard'

const mapState = state => ({
  publications: getPublications(state)
})

export default connect(mapState)(EstateCard)
