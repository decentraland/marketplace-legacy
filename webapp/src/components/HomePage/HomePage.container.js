import { connect } from 'react-redux'
import { isLoading } from 'modules/publication/selectors'
import { getParcels, getEstates } from 'modules/ui/marketplace/selectors'
import { fetchPublicationsRequest } from 'modules/publication/actions'
import { navigateTo } from 'modules/location/actions'

import HomePage from './HomePage'

const mapState = (state, { location }) => {
  const parcels = getParcels(state)
  const estates = getEstates(state)

  return {
    parcels,
    estates,
    isLoading: isLoading(state)
  }
}

const mapDispatch = (dispatch, { location }) => ({
  onFetchPublications: () =>
    dispatch(
      fetchPublicationsRequest({
        //@nacho TODO: fetch all
        limit: 20,
        offset: 0
      })
    ),
  onNavigate: url => dispatch(navigateTo(url))
})

export default connect(mapState, mapDispatch)(HomePage)
