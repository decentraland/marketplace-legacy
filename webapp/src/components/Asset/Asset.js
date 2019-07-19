import React from 'react'
import PropTypes from 'prop-types'
import { Loader } from 'semantic-ui-react'

import { walletType, assetType, actionType } from 'components/types'
import NotFound from 'components/NotFound'
import { can, isOwner } from 'shared/roles'

let shouldRefresh = false
let isNavigatingAway = false
let isAssetPrefetched = false

export default class Asset extends React.PureComponent {
  static propTypes = {
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

  componentWillReceiveProps(nextProps) {
    const { id, wallet, asset, isConnecting, isLoading } = nextProps

    if (isConnecting || isLoading) {
      return
    }

    if (this.props.id !== id) {
      shouldRefresh = true
    }

    if (!this.isValid(wallet, asset)) {
      return this.redirect()
    }

    // Will run only once. After mount and wallet connection is resolved
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

    let ownership = true

    if (shouldBeOwner !== undefined) {
      ownership = ownership && (isAssetOwner && shouldBeOwner)
    }

    if (shouldDisallowOwner !== undefined) {
      ownership = ownership && (!isAssetOwner && !!asset && shouldDisallowOwner)
    }

    return ownership
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
    return shouldBeOnSale && !!asset && !asset['publication_tx_hash']
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

    if (!asset || isLoading) {
      const shouldBeConnected = shouldBeOwner || shouldDisallowOwner

      if (
        (shouldBeConnected && isConnecting) ||
        isNavigatingAway ||
        isLoading
      ) {
        return (
          <div>
            <Loader active size="massive" />
          </div>
        )
      } else {
        return <NotFound />
      }
    }
    return children(asset, { isOwner: isOwner(wallet.address, asset), wallet })
  }
}
