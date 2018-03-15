import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { isLoading } from 'modules/publication/selectors'
import { getPublications, getTotal } from 'modules/ui/marketplace/selectors'
import { fetchPublicationsRequest } from 'modules/publication/actions'
import { navigateTo } from 'modules/location/actions'

import { getOptionsFromRouter, PAGE_SIZE } from './utils'

import MarketplacePage from './MarketplacePage'

const mapState = (state, { location }) => {
  const { limit, offset, sortBy, sortOrder } = getOptionsFromRouter(location)
  const page = offset / PAGE_SIZE + 1
  const publications = getPublications(state)
  const total = getTotal(state)
  return {
    limit,
    offset,
    sortBy,
    sortOrder,
    page,
    pages: Math.ceil(total / PAGE_SIZE),
    isEmpty: publications.length === 0,
    publications,
    isLoading: isLoading(state)
  }
}

const mapDispatch = (dispatch, { location }) => ({
  onFetchPublications: () =>
    dispatch(fetchPublicationsRequest(getOptionsFromRouter(location))),
  onNavigate: url => dispatch(navigateTo(url))
})

export default withRouter(connect(mapState, mapDispatch)(MarketplacePage))
