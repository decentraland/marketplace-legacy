import { connect } from 'react-redux'
import { locations } from 'locations'
import { push } from 'react-router-redux'
import { fetchParcelRequest } from 'modules/parcels/actions'
import {
  getWallet,
  isConnecting as isWalletConnecting
} from 'modules/wallet/selectors'
import {
  isLoading as isAddressLoading,
  getData as getAddresses
} from 'modules/address/selectors'
import { getParcels, getLoading } from 'modules/parcels/selectors'
import { buildCoordinate } from 'lib/utils'

import Parcel from './Parcel'

const mapState = (state, { x, y }) => {
  const parcels = getParcels(state)
  const parcel = parcels[buildCoordinate(x, y)]

  const wallet = getWallet(state)
  const addresses = getAddresses(state)
  let isConnecting = isWalletConnecting(state) || isAddressLoading(state)
  if (
    wallet &&
    wallet.address &&
    addresses[wallet.address] &&
    addresses[wallet.address].parcel_ids
  ) {
    isConnecting = false
  }

  const isLoading = getLoading(state).some(
    action => action.x === x && action.y === y
  )

  return {
    wallet,
    addresses,
    isConnecting,
    isLoading,
    parcel
  }
}

const mapDispatch = (dispatch, { x, y }) => ({
  onFetchParcel: () => dispatch(fetchParcelRequest(x, y)),
  onAccessDenied: () => dispatch(push(locations.parcelDetail(x, y)))
})

export default connect(mapState, mapDispatch)(Parcel)
