import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { connectWalletRequest } from 'modules/wallet/actions'
import { fetchAddress } from 'modules/address/actions'
import { getLoading } from 'modules/address/selectors'
import { getAddresses } from 'modules/address/selectors'

import ProfilePage from './ProfilePage'
import { getPageFromRouter, TABS, paginate } from './utils'

const mapState = (state, { location, match }) => {
  let { address, tab } = match.params
  const addresses = getAddresses(state)
  let parcels = []
  let contributions = []
  let publications = []
  if (address in addresses) {
    parcels = addresses[address].parcels
    contributions = addresses[address].contributions
    publications = addresses[address].publications
  }
  const isLoading = getLoading(state).some(action => action.address === address)
  if (!Object.values(TABS).includes(tab)) {
    tab = TABS.parcels
  }
  const page = getPageFromRouter(location)
  let pagination
  switch (tab) {
    case TABS.PUBLICATIONS: {
      pagination = paginate(publications, page)
      break
    }
    case TABS.CONTRIBUTIONS: {
      pagination = paginate(contributions, page)
      break
    }
    case TABS.PARCELS:
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
    isEmpty
  }
}

const mapDispatch = (dispatch, { match }) => ({
  onConnect: () => dispatch(connectWalletRequest()),
  onFetchAddress: () => dispatch(fetchAddress(match.params.address)),
  onNavigate: url => dispatch(push(url))
})

export default withRouter(connect(mapState, mapDispatch)(ProfilePage))
