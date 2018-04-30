import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { isLoading } from 'modules/publication/selectors'
import { getParcels, getTotal } from 'modules/ui/marketplace/selectors'
import { fetchPublicationsRequest } from 'modules/publication/actions'
import { navigateTo } from 'modules/location/actions'
import { Pagination } from 'lib/Pagination'

import { getOptionsFromRouter } from './utils'

import MarketplacePage from './MarketplacePage'

const mapState = (state, { location }) => {
  const { limit, offset, sortBy, sortOrder, status } = getOptionsFromRouter(
    location
  )
  const parcels = getParcels(state)
  const total = getTotal(state)
  const pagination = new Pagination(total)
  const page = pagination.getCurrentPage(offset)
  const pages = pagination.getPageCount()

  return {
    limit,
    offset,
    sortBy,
    sortOrder,
    status,
    page,
    pages,
    total,
    parcels,
    isEmpty: parcels.length === 0,
    isLoading: isLoading(state)
  }
}

const mapDispatch = (dispatch, { location }) => ({
  onFetchPublications: () =>
    dispatch(fetchPublicationsRequest(getOptionsFromRouter(location))),
  onNavigate: url => dispatch(navigateTo(url))
})

export default withRouter(connect(mapState, mapDispatch)(MarketplacePage))
