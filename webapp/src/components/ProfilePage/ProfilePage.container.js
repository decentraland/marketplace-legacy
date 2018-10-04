import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import { PROFILE_PAGE_TABS, locations } from 'locations'
import { getLoading } from 'modules/address/selectors'
import { getWallet, isConnecting } from 'modules/wallet/selectors'
import { getAddresses } from 'modules/address/selectors'
import { fetchAddress } from 'modules/address/actions'
import { navigateTo } from 'modules/location/actions'
import { Location } from 'lib/Location'
import { Pagination } from 'lib/Pagination'

import ProfilePage from './ProfilePage'

const mapState = (state, { location, match }) => {
  let { tab } = match.params
  const address = match.params.address.toLowerCase()
  const wallet = getWallet(state)
  const addresses = getAddresses(state)
  const isLoading = getLoading(state).some(action => action.address === address)
  const page = new Location(location).getPageFromRouter()

  let parcels = []
  let contributions = []
  let publishedParcels = []
  let estates = []
  let mortgagedParcels = []
  if (address in addresses) {
    parcels = addresses[address].parcels
    contributions = addresses[address].contributions
    publishedParcels = addresses[address].publishedParcels
    estates = addresses[address].estates
    mortgagedParcels = addresses[address].mortgagedParcels
  }

  if (!Object.values(PROFILE_PAGE_TABS).includes(tab)) {
    tab = PROFILE_PAGE_TABS.parcels
  }

  let pagination
  switch (tab) {
    case PROFILE_PAGE_TABS.publications: {
      pagination = Pagination.paginate(publishedParcels, page)
      break
    }
    case PROFILE_PAGE_TABS.contributions: {
      pagination = Pagination.paginate(contributions, page)
      break
    }
    case PROFILE_PAGE_TABS.estates: {
      pagination = Pagination.paginate(estates, page)
      break
    }
    case PROFILE_PAGE_TABS.mortgages: {
      pagination = Pagination.paginate(mortgagedParcels, page)
      break
    }
    case PROFILE_PAGE_TABS.parcels:
    default: {
      pagination = Pagination.paginate(parcels, page)
    }
  }
  const [grid, isEmpty, pages] = pagination

  return {
    address,
    parcels,
    contributions,
    publishedParcels,
    estates,
    mortgagedParcels,
    grid,
    tab,
    page,
    pages,
    isLoading,
    isEmpty,
    isOwner: wallet.address === address,
    isConnecting: isConnecting(state)
  }
}

const mapDispatch = (dispatch, { match }) => ({
  onFetchAddress: () => dispatch(fetchAddress(match.params.address)),
  onNavigate: url => dispatch(navigateTo(url)),
  onAccessDenied: () => dispatch(navigateTo(locations.marketplacePageDefault()))
})

export default withRouter(connect(mapState, mapDispatch)(ProfilePage))
