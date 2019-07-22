import { connect } from 'react-redux'

import {
  getWallet,
  isConnecting as isWalletConnecting
} from 'modules/wallet/selectors'
import { getData as getPublications } from 'modules/publication/selectors'
import { getWalletBidsByAsset } from 'modules/bid/selectors'
import { ASSET_TYPES } from 'shared/asset'

import Permission from './Permission'

const mapState = (state, { asset, assetType }) => ({
  wallet: getWallet(state),
  isConnecting: isWalletConnecting(state),
  publications: getPublications(state),
  bids: getWalletBidsByAsset(state, asset, assetType)
})

const mapDispatch = () => ({})

export default connect(mapState, mapDispatch)(Permission)
