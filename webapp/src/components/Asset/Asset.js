import React from 'react'
import PropTypes from 'prop-types'
import { Loader } from 'semantic-ui-react'

import {
  walletType,
  assetType,
  assetTypingType,
  actionType
} from 'components/types'
import NotFound from 'components/NotFound'
import { can, isOwner } from 'shared/roles'

let shouldRefresh = false
let isNavigatingAway = false
let isAssetPrefetched = false

export default class Asset extends React.PureComponent {
  static propTypes = {
    assetId: PropTypes.string,
    assetType: assetTypingType,
    wallet: walletType.isRequired,
    asset: assetType,
    shouldBeAllowedTo: PropTypes.arrayOf(actionType),
    shouldBeOwner: PropTypes.bool,
    shouldDisallowOwner: PropTypes.bool,
    shouldBeOnSale: PropTypes.bool,
    isConnecting: PropTypes.bool,
    isLoading: PropTypes.bool.isRequired,
    children: PropTypes.func.isRequired,
    onAccessDenied: PropTypes.func.isRequired
  }

  static defaultProps = {
    asset: null,
    shouldBeAllowedTo: [],
    isConnecting: false,
    isLoading: false
  }

  componentWillMount() {
    if (this.props.isLoading) {
      return
    }
    this.prefetchAsset()
  }

  componentWillReceiveProps(nextProps) {
    const {
      assetId,
      assetType,
      wallet,
      asset,
      isConnecting,
      isLoading
    } = nextProps

    if (isConnecting || isLoading) {
      return
    }

    if (this.props.assetId !== assetId && this.props.assetType !== assetType) {
      shouldRefresh = true
    }

    if (!this.isValid(wallet, asset)) {
      return this.redirect()
    }

    // Will run only once after every asset change
    this.prefetchAsset()
  }

  componentDidUpdate() {
    if (shouldRefresh) {
      this.props.onFetchAsset()
      shouldRefresh = false
    }
  }

  componentWillUnmount() {
    isNavigatingAway = false
    isAssetPrefetched = false
  }

  isValid(wallet, asset) {
    return (
      this.isValidOwnership(wallet, asset) &&
      this.isValidRole(wallet, asset) &&
      this.isValidAssetState(asset)
    )
  }

  isValidOwnership(wallet, asset) {
    const { shouldDisallowOwner, shouldBeOwner } = this.props
    const isAssetOwner = isOwner(wallet.address, asset)

    let isValid = true

    if (shouldBeOwner !== undefined) {
      isValid = isValid && (isAssetOwner && shouldBeOwner)
    }

    if (shouldDisallowOwner !== undefined) {
      isValid = isValid && (!isAssetOwner && !!asset && shouldDisallowOwner)
    }

    return isValid
  }

  isValidRole(wallet, asset) {
    const { shouldBeAllowedTo } = this.props
    return shouldBeAllowedTo.every(action => can(action, wallet.address, asset))
  }

  isValidAssetState(asset) {
    const { shouldBeOnSale } = this.props
    if (shouldBeOnSale === undefined) {
      return true
    }
    return shouldBeOnSale && !!asset && asset['publication_tx_hash'] != null
  }

  redirect() {
    if (!isNavigatingAway) {
      isNavigatingAway = true
      return this.props.onAccessDenied()
    }
  }

  prefetchAsset() {
    if (!isAssetPrefetched) {
      this.props.onFetchAsset()
      isAssetPrefetched = true
    }
  }

  render() {
    const {
      asset,
      isConnecting,
      shouldBeOwner,
      shouldDisallowOwner,
      isLoading,
      wallet,
      children
    } = this.props

    const shouldBeConnected = shouldBeOwner || shouldDisallowOwner

    if (isNavigatingAway || isLoading || (shouldBeConnected && isConnecting)) {
      return (
        <div>
          <Loader active size="massive" />
        </div>
      )
    }

    if (!asset) {
      return <NotFound />
    }

    return children(asset, { isOwner: isOwner(wallet.address, asset), wallet })
  }
}
