import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { isLoading } from 'modules/publication/selectors'
import {
  getParcels,
  getEstates,
  getTotals
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
  const totals = getTotals(state)

  let isEmpty, pagination
  if (tab === MARKETPLACE_PAGE_TABS.parcels) {
    isEmpty = parcels.length === 0
    pagination = new Pagination(totals.parcel)
  } else if (tab === MARKETPLACE_PAGE_TABS.estates) {
    isEmpty = estates.length === 0
    pagination = new Pagination(totals.estate)
  }
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
    parcels,
    estates,
    tab,
    isEmpty,
    totals,
    isLoading: isLoading(state)
  }
}

const mapDispatch = (dispatch, { location, match }) => {
  let { tab } = match.params
  return {
    onFetchPublications: () =>
      dispatch(
        fetchPublicationsRequest({ ...getOptionsFromRouter(location), tab })
      ),
    onNavigate: url => dispatch(navigateTo(url))
  }
}

export default withRouter(connect(mapState, mapDispatch)(MarketplacePage))
