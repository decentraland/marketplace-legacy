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
import { isOnSale } from 'modules/asset/utils'

let shouldRefresh = false
let isNavigatingAway = false
let isAssetPrefetched = false

/**
 * Fetch an asset via type and id
 * Use a function as children to get the result, the component will handle loading states and not founds
 * Keep in mind that `should(...)` properties have three states, true/false/undefined. So for example:
 *   <Asset id="1" assetType="parcel">                        // Anyone can access
 *   <Asset id="1" assetType="parcel" shouldBeOnSale={true}>  // You can only access if it's on sale
 *   <Asset id="1" assetType="parcel" shouldBeOnSale={false}> // You can only access if it is NOT on sale
 */
export default class Asset extends React.PureComponent {
  static propTypes = {
    assetId: PropTypes.string,
    assetType: assetTypingType,
    wallet: walletType.isRequired,
    asset: assetType,
    shouldBeAllowedTo: PropTypes.arrayOf(actionType),
    shouldBeOwner: PropTypes.bool,
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
      console.log('aaaa', wallet, asset)
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
    const { shouldBeOwner } = this.props

    if (shouldBeOwner === undefined) {
      return true
    }
    return shouldBeOwner === isOwner(wallet.address, asset)
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
    return shouldBeOnSale === isOnSale(asset)
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
      isLoading,
      wallet,
      children
    } = this.props

    if (isNavigatingAway || isLoading || (shouldBeOwner && isConnecting)) {
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
