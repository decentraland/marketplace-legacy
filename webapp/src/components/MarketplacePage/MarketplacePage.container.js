import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { connectWalletRequest } from 'modules/wallet/actions'
import { fetchPublicationsRequest } from 'modules/publication/actions'
import { getPublications } from 'modules/ui/marketplace/selectors'

import { getOptionsFromRouter, PAGE_SIZE } from './utils'

import MarketplacePage from './MarketplacePage'

const mapState = (state, { location }) => {
  const { limit, offset, sortBy, sortOrder } = getOptionsFromRouter(location)
  const page = offset / PAGE_SIZE
  const publications = getPublications(state)
  return {
    limit,
    offset,
    sortBy,
    sortOrder,
    page,
    publications
  }
}

const mapDispatch = (dispatch, { location }) => ({
  onConnect: () => dispatch(connectWalletRequest()),
  onFetchPublications: () =>
    dispatch(fetchPublicationsRequest(getOptionsFromRouter(location)))
})

export default withRouter(connect(mapState, mapDispatch)(MarketplacePage))
