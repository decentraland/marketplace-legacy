import { connect } from 'react-redux'
import {
  getWallet,
  isConnecting as isWalletConnecting
} from 'modules/wallet/selectors'
import {
  isLoading as isAddressLoading,
  getData as getAddresses
} from 'modules/address/selectors'

import Asset from './Asset'
import { getPublications } from 'modules/publication/selectors'

const mapState = (state, { value: asset, isConnected }) => {
  const wallet = getWallet(state)
  const addresses = getAddresses(state)

  let isConnecting = isWalletConnecting(state) || isAddressLoading(state)

  if (
    wallet &&
    wallet.address &&
    addresses[wallet.address] &&
    isConnected(addresses[wallet.address])
  ) {
    isConnecting = false
  }

  if (asset) {
    const publications = getPublications(state)
    asset.publication = publications[asset.publication_tx_hash]
  }

  return {
    wallet,
    addresses,
    isConnecting,
    asset
  }
}

const mapDispatch = dispatch => ({})

export default connect(mapState, mapDispatch)(Asset)
