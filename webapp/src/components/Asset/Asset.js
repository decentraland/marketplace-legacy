import React from 'react'
import PropTypes from 'prop-types'
import { Loader } from 'semantic-ui-react'

import { walletType, assetType } from 'components/types'
import NotFound from 'components/NotFound'
import { isOwner } from 'shared/roles'

let shouldRefresh = false
let isNavigatingAway = false
let isAssetPrefetched = false

export default class Asset extends React.PureComponent {
  static propTypes = {
    wallet: walletType.isRequired,
    asset: assetType,
    isConnecting: PropTypes.bool,
    isLoading: PropTypes.bool.isRequired,
    ownerOnly: PropTypes.bool,
    ownerNotAllowed: PropTypes.bool,
    onAccessDenied: PropTypes.func.isRequired,
    withPublications: PropTypes.bool,
    children: PropTypes.func.isRequired
  }

  static defaultProps = {
    isConnecting: false,
    isLoading: false,
    ownerOnly: false,
    ownerNotAllowed: false,
    withPublications: false,
    asset: null,
    publication: null
  }

  componentWillReceiveProps(nextProps) {
    const {
      id,
      asset,
      isConnecting,
      isLoading,
      ownerOnly,
      wallet,
      ownerNotAllowed,
      withPublications
    } = nextProps

    if (isConnecting || isLoading) {
      return
    }

    if (this.props.id !== id) {
      shouldRefresh = true
    }

    const ownerIsNotAllowed =
      ownerNotAllowed && asset && isOwner(wallet.address, asset)
    const assetShouldBeOnSale =
      withPublications && asset && !asset['publication_tx_hash']

    if (ownerOnly) {
      this.checkOwnership(wallet, asset)
    }

    if (ownerIsNotAllowed || assetShouldBeOnSale) {
      this.redirect()
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

  redirect() {
    if (!isNavigatingAway) {
      isNavigatingAway = true
      return this.props.onAccessDenied()
    }
  }

  checkOwnership(wallet, asset) {
    if (!isOwner(wallet.address, asset)) {
      this.redirect()
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
      ownerOnly,
      ownerNotAllowed,
      isLoading,
      wallet,
      children
    } = this.props

    if (!asset || isLoading) {
      const shouldBeConnected = ownerOnly || ownerNotAllowed

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
