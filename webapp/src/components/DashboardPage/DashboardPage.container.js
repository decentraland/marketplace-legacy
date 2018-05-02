import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import {
  getStats,
  getPublications,
  isLoading,
  getError
} from 'modules/dashboard/selectors'
import { isLoading as isPublicationsLoading } from 'modules/publication/selectors'
import { fetchDashboardStatsRequest } from 'modules/dashboard/actions'
import { fetchDashboardPublicationsRequest } from 'modules/publication/actions'
import { PUBLICATION_STATUS } from 'modules/publication/utils'

import DashboardPage from './DashboardPage'

const mapState = (state, { location }) => {
  return {
    stats: getStats(state),
    isLoading: isLoading(state),
    isPublicationsLoading: isPublicationsLoading(state),
    error: getError(state),
    publications: getPublications(state)
  }
}

const mapDispatch = (dispatch, { location }) => ({
  onFetchDashboardStats: () => dispatch(fetchDashboardStatsRequest()),
  onFetchDashboardPublications: () =>
    dispatch(
      fetchDashboardPublicationsRequest({
        limit: 10,
        offset: 0,
        sortBy: 'block_time_updated_at',
        sortOrder: 'desc',
        status: PUBLICATION_STATUS.sold
      })
    )
})

export default withRouter(connect(mapState, mapDispatch)(DashboardPage))
