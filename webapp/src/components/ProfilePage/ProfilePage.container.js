import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { navigateTo } from '@dapps/modules/location/actions'

import { PROFILE_PAGE_TABS, locations } from 'locations'
import { Location } from 'lib/Location'
import { Pagination } from 'lib/Pagination'
import { fetchAddress } from 'modules/address/actions'
import { getLoading } from 'modules/address/selectors'
import { getWallet, isConnecting } from 'modules/wallet/selectors'
import { getAddresses } from 'modules/address/selectors'
import { getData as getArchivedBids } from 'modules/archivedBid/selectors'
import { orderBids } from 'modules/bid/utils'
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
  let publishedEstates = []
  let bids = []
  if (address in addresses) {
    parcels = addresses[address].parcels
    contributions = addresses[address].contributions
    publishedParcels = addresses[address].publishedParcels
    publishedEstates = addresses[address].publishedEstates
    estates = addresses[address].estates
    bids = orderBids(addresses[address].bids, address)
    mortgagedParcels = addresses[address].mortgagedParcels
  }

  if (!Object.values(PROFILE_PAGE_TABS).includes(tab)) {
    tab = PROFILE_PAGE_TABS.parcels
  }

  const publishedAssets = publishedParcels.concat(publishedEstates)
  const archivedBids = getArchivedBids(state)

  if (tab === PROFILE_PAGE_TABS.archivebids) {
    bids = bids.filter(bid => archivedBids[bid.id])
  } else {
    bids = bids.filter(bid => !archivedBids[bid.id])
  }

  let pagination
  switch (tab) {
    case PROFILE_PAGE_TABS.publications: {
      pagination = Pagination.paginate(publishedAssets, page)
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
    case PROFILE_PAGE_TABS.bids: {
      bids = orderBids(bids, address)
      pagination = Pagination.paginate(bids, page)
      break
    }
    case PROFILE_PAGE_TABS.archivebids: {
      bids = orderBids(bids, address)
      pagination = Pagination.paginate(bids, page)
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
    publishedAssets,
    estates,
    mortgagedParcels,
    grid,
    tab,
    page,
    pages,
    isLoading,
    isEmpty,
    bids,
    isOwner: wallet.address === address,
    isConnecting: isConnecting(state)
  }
}

const mapDispatch = (dispatch, { match }) => ({
  onFetchAddress: address =>
    dispatch(fetchAddress(address || match.params.address)),
  onNavigate: url => dispatch(navigateTo(url)),
  onAccessDenied: () => dispatch(navigateTo(locations.marketplace()))
})

export default withRouter(connect(mapState, mapDispatch)(ProfilePage))
