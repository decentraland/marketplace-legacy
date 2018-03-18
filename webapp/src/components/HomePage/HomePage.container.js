import { connect } from 'react-redux'
import { isLoading } from 'modules/publication/selectors'
import { getPublications, getTotal } from 'modules/ui/marketplace/selectors'
import { fetchPublicationsRequest } from 'modules/publication/actions'
import { navigateTo } from 'modules/location/actions'

import HomePage from './HomePage'

const mapState = (state, { location }) => {
  const publications = getPublications(state)
  const total = getTotal(state)
  return {
    publications,
    total,
    isLoading: isLoading(state)
  }
}

const mapDispatch = (dispatch, { location }) => ({
  onFetchPublications: () =>
    dispatch(
      fetchPublicationsRequest({
        limit: 20,
        offset: 0,
        sortBy: 'created_at',
        sortOrder: 'asc'
      })
    ),
  onNavigate: url => dispatch(navigateTo(url))
})

export default connect(mapState, mapDispatch)(HomePage)
