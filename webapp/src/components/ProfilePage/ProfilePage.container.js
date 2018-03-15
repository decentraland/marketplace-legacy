import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { PROFILE_PAGE_TABS } from 'locations'
import { getLoading } from 'modules/address/selectors'
import { getWallet } from 'modules/wallet/selectors'
import { getAddresses } from 'modules/address/selectors'
import { fetchAddress } from 'modules/address/actions'
import { navigateTo } from 'modules/location/actions'
import { getPageFromRouter, paginate } from './utils'

import ProfilePage from './ProfilePage'

const mapState = (state, { location, match }) => {
  let { tab } = match.params
  const address = match.params.address.toLowerCase()
  const wallet = getWallet(state)
  const addresses = getAddresses(state)
  const isLoading = getLoading(state).some(action => action.address === address)
  const page = getPageFromRouter(location)

  let parcels = []
  let contributions = []
  let publications = []
  if (address in addresses) {
    parcels = addresses[address].parcels
    contributions = addresses[address].contributions
    publications = addresses[address].publications
  }

  if (!Object.values(PROFILE_PAGE_TABS).includes(tab)) {
    tab = PROFILE_PAGE_TABS.parcels
  }

  let pagination
  switch (tab) {
    case PROFILE_PAGE_TABS.publications: {
      pagination = paginate(publications, page)
      break
    }
    case PROFILE_PAGE_TABS.contributions: {
      pagination = paginate(contributions, page)
      break
    }
    case PROFILE_PAGE_TABS.parcels:
    default: {
      pagination = paginate(parcels, page)
    }
  }
  const [grid, isEmpty, pages] = pagination

  return {
    address,
    parcels,
    contributions,
    publications,
    grid,
    tab,
    page,
    pages,
    isLoading,
    isEmpty,
    isOwner: wallet.address === address
  }
}

const mapDispatch = (dispatch, { match }) => ({
  onFetchAddress: () => dispatch(fetchAddress(match.params.address)),
  onNavigate: url => dispatch(navigateTo(url))
})

export default withRouter(connect(mapState, mapDispatch)(ProfilePage))
