import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import { getParams } from 'modules/location/selectors'
import {
  getWallet,
  isLoading as isWalletLoading
} from 'modules/wallet/selectors'
import {
  getParcels,
  getError as getParcelError
} from 'modules/parcels/selectors'
import {
  getData as getAddresses,
  isLoading as isAddressLoading
} from 'modules/address/selectors'
import { connectWalletRequest } from 'modules/wallet/actions'
import { fetchParcelRequest } from 'modules/parcels/actions'
import { navigateTo } from 'modules/location/actions'

import { buildCoordinate } from 'lib/utils'

import ParcelDetailPage from './ParcelDetailPage'

const mapState = (state, ownProps) => {
  const { x, y } = getParams(ownProps)
  const parcels = getParcels(state)
  const parcel = parcels[buildCoordinate(x, y)]

  const wallet = getWallet(state)
  const addresses = getAddresses(state)
  let isLoading = !parcel || isWalletLoading(state) || isAddressLoading(state)
  if (wallet && wallet.address && addresses[wallet.address]) {
    isLoading = false
  }

  return {
    isLoading,
    hasError: !!getParcelError(state),
    isOwner: parcel && parcel.owner ? wallet.address === parcel.owner : false,
    parcel,
    x,
    y
  }
}

const mapDispatch = dispatch => ({
  onNavigate: location => dispatch(navigateTo(location)),
  onConnect: () => dispatch(connectWalletRequest()),
  onFetchParcel: (x, y) => dispatch(fetchParcelRequest(x, y))
})

export default withRouter(connect(mapState, mapDispatch)(ParcelDetailPage))
