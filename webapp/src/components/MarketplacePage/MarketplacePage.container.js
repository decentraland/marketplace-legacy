import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { isLoading } from 'modules/publication/selectors'
import {
  getParcels,
  getEstates,
  getTotal
} from 'modules/ui/marketplace/selectors'
import { fetchPublicationsRequest } from 'modules/publication/actions'
import { navigateTo } from 'modules/location/actions'
import { Pagination } from 'lib/Pagination'
import { MARKETPLACE_PAGE_TABS } from 'locations'
import { getOptionsFromRouter } from './utils'
import MarketplacePage from './MarketplacePage'

const mapState = (state, { location, match }) => {
  let { tab } = match.params
  const { limit, offset, sortBy, sortOrder, status } = getOptionsFromRouter(
    location
  )
  const parcels = getParcels(state)
  const estates = getEstates(state)
  const total = getTotal(state)
  const pagination = new Pagination(total)
  const page = pagination.getCurrentPage(offset)
  const pages = pagination.getPageCount()

  if (!Object.values(MARKETPLACE_PAGE_TABS).includes(tab)) {
    tab = MARKETPLACE_PAGE_TABS.parcels
  }

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
    estates,
    tab,
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
