import React from 'react'
import PropTypes from 'prop-types'
import { Loader } from 'semantic-ui-react'

import { walletType } from 'components/types'
import NotFound from 'components/NotFound'
import { isOwner } from 'shared/asset'

let shouldRefresh = false
let isNavigatingAway = false
let isAssetFetched = false

export default class Asset extends React.PureComponent {
  static propTypes = {
    wallet: walletType.isRequired,
    value: PropTypes.object,
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
    value: null,
    publication: null
  }

  componentWillReceiveProps(nextProps) {
    const {
      id,
      value,
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

    if (!isConnecting) {
      this.fetchAsset()
    }

    if (this.props.id !== id) {
      shouldRefresh = true
    }

    const ownerIsNotAllowed =
      ownerNotAllowed && value && isOwner(wallet, value.id)
    const assetShouldBeOnSale =
      withPublications && value && !value['publication_tx_hash']

    if (ownerOnly) {
      this.checkOwnership(wallet, value.id)
    }

    if (ownerIsNotAllowed || assetShouldBeOnSale) {
      this.redirect()
    }
  }

  componentDidUpdate() {
    if (shouldRefresh) {
      this.props.onFetchAsset()
      shouldRefresh = false
    }
  }

  componentWillUnmount() {
    isNavigatingAway = false
    isAssetFetched = false
  }

  redirect() {
    if (!isNavigatingAway) {
      isNavigatingAway = true
      return this.props.onAccessDenied()
    }
  }

  checkOwnership(wallet, assetId) {
    if (!isOwner(wallet, assetId)) {
      this.redirect()
    }
  }

  fetchAsset() {
    if (!isAssetFetched) {
      this.props.onFetchAsset()
      isAssetFetched = true
    }
  }

  render() {
    const {
      value,
      isConnecting,
      ownerOnly,
      ownerNotAllowed,
      isLoading,
      wallet,
      children
    } = this.props

    if (!value || isLoading) {
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
    return children(value, { isOwner: isOwner(wallet, value.id), wallet })
  }
}
