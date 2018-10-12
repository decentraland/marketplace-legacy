import React from 'react'
import PropTypes from 'prop-types'
import { Loader } from 'semantic-ui-react'
import { walletType } from 'components/types'
import { isOwner } from 'shared/asset'

export let shouldRefresh = false
export let isNavigatingAway = false

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

  componentWillMount() {
    const { value, isLoading, onFetchAsset } = this.props
    if (value || isLoading) {
      return
    }
    onFetchAsset()
  }

  componentDidUpdate() {
    if (shouldRefresh) {
      shouldRefresh = false
      const { onFetchAsset } = this.props
      onFetchAsset()
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      value,
      isConnecting,
      isLoading,
      ownerOnly,
      wallet,
      ownerNotAllowed,
      withPublications
    } = nextProps

    const ownerIsNotAllowed =
      ownerNotAllowed && value && isOwner(wallet, value.id)
    const assetShouldBeOnSale =
      withPublications && value && !value['publication_tx_hash']

    if (isConnecting || isLoading) {
      return
    }

    if (ownerOnly) {
      this.checkOwnership(wallet, value.id)
    }

    if (ownerIsNotAllowed || assetShouldBeOnSale || !value) {
      this.redirect()
    }

    if (this.props.value && value && this.props.value.id !== value.id) {
      shouldRefresh = true
    }
  }

  redirect() {
    const { onAccessDenied } = this.props
    if (!isNavigatingAway) {
      isNavigatingAway = true
      return onAccessDenied()
    }
  }

  checkOwnership(wallet, assetId) {
    const { onAccessDenied } = this.props
    if (!isNavigatingAway && !isOwner(wallet, assetId)) {
      isNavigatingAway = true
      return onAccessDenied()
    }
  }

  render() {
    const {
      value,
      wallet,
      isConnecting,
      children,
      ownerOnly,
      ownerNotAllowed
    } = this.props
    const shouldBeConnected = ownerOnly || ownerNotAllowed

    return (shouldBeConnected && isConnecting) || isNavigatingAway || !value ? (
      <div>
        <Loader active size="massive" />
      </div>
    ) : (
      children(value, isOwner(wallet, value.id), wallet)
    )
  }
}
