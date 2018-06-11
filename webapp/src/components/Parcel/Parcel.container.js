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
import { getData as getParcels, getLoading } from 'modules/parcels/selectors'
import { getPublications } from 'modules/publication/selectors'
import { buildCoordinate, getCoordsMatcher } from 'shared/parcel'

import Parcel from './Parcel'

const mapState = (state, { x, y }) => {
  const parcels = getParcels(state)
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

  const isLoading = getLoading(state).some(getCoordsMatcher({ x, y }))

  let publication = null
  let parcel = parcels[buildCoordinate(x, y)]
  if (parcel) {
    const publications = getPublications(state)
    publication = publications[parcel.publication_tx_hash]
    parcel = { ...parcel, publication }
  }

  return {
    wallet,
    addresses,
    isConnecting,
    isLoading,
    parcel,
    publication
  }
}

const mapDispatch = (dispatch, { x, y }) => ({
  onFetchParcel: () => dispatch(fetchParcelRequest(x, y)),
  onAccessDenied: () => dispatch(push(locations.parcelDetail(x, y)))
})

export default connect(mapState, mapDispatch)(Parcel)
