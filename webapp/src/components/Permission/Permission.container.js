import { connect } from 'react-redux'

import {
  getWallet,
  isConnecting as isWalletConnecting
} from 'modules/wallet/selectors'
import { isLoading as isAddressLoading } from 'modules/address/selectors'
import { getData as getPublications } from 'modules/publication/selectors'
import { getWalletBidsByAsset } from 'modules/bid/selectors'
import { ASSET_TYPES } from 'shared/asset'

import Permission from './Permission'

const mapState = (state, { asset, assetType }) => ({
  wallet: getWallet(state),
  isConnecting: isWalletConnecting(state) || isAddressLoading(state),
  publications: getPublications(state),
  bids: getWalletBidsByAsset(state, asset, assetType)
})

const mapDispatch = () => ({})

export default connect(mapState, mapDispatch)(Permission)
