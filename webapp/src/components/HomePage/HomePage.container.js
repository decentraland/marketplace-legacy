import { connect } from 'react-redux'
import { navigateTo } from '@dapps/modules/location/actions'

import { isLoading } from 'modules/publication/selectors'
import { getAssets } from 'modules/ui/marketplace/selectors'
import { fetchPublicationsRequest } from 'modules/publication/actions'
import { learnMoreAuction } from 'modules/auction/actions'

import HomePage from './HomePage'

const mapState = state => {
  const assets = getAssets(state)

  return {
    assets,
    isLoading: isLoading(state)
  }
}

const mapDispatch = dispatch => ({
  onFetchPublications: () =>
    dispatch(
      fetchPublicationsRequest({
        limit: 20,
        offset: 0
      })
    ),
  onNavigate: url => dispatch(navigateTo(url)),
  onLearnMoreAuction: () => dispatch(learnMoreAuction())
})

export default connect(mapState, mapDispatch)(HomePage)
