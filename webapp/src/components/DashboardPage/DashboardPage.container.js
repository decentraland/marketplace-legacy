import { connect } from 'react-redux'
import { getData, isLoading, getError } from 'modules/dashboard/selectors'
import {
  fetchDashboardStatsRequest
  // ,fetchDashboardTransactionsRequest
} from 'modules/dashboard/actions'

import DashboardPage from './DashboardPage'

const mapState = state => {
  return {
    dashboard: getData(state),
    isLoading: isLoading(state),
    error: getError(state)
  }
}

const mapDispatch = (dispatch, { location }) => ({
  onFetchDashboardStats: () => dispatch(fetchDashboardStatsRequest())
  // ,onFetchDashboardTransactions: () => dispatch(fetchDashboardTransactionsRequest())
})

export default connect(mapState, mapDispatch)(DashboardPage)
