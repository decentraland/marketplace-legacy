import React from 'react'
import PropTypes from 'prop-types'
import { Loader } from 'semantic-ui-react'

import { walletType } from 'components/types'
import NotFound from 'components/NotFound'
import { isOwner } from 'shared/asset'

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

  constructor(props) {
    super(props)
    this.shouldRefresh = false
    this.isNavigatingAway = false
    this.oldValue = null
  }

  componentWillMount() {
    const { value, isLoading, onFetchAsset } = this.props
    if (value || isLoading) {
      return
    }
    console.log('componentWillMount')
    onFetchAsset()
  }

  componentWillReceiveProps(nextProps) {
    const {
      value,
      isConnecting,
      isLoaded,
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

    if (!isLoaded && isLoading) {
      this.shouldRefresh = true
    } else {
      this.oldValue = value
    }

    if (isConnecting || isLoading) {
      return
    }

    if (ownerOnly) {
      this.checkOwnership(wallet, value.id)
    }

    if (ownerIsNotAllowed || assetShouldBeOnSale) {
      this.redirect()
    }
    if (this.props.value && value && this.props.value.id !== value.id) {
      this.shouldRefresh = true
      this.oldValue = value
    }
  }

  componentDidUpdate() {
    if (this.shouldRefresh) {
      this.shouldRefresh = false
      this.props.onFetchAsset()
    }
  }

  componentWillUnmount() {
    this.isNavigatingAway = false
  }

  redirect() {
    const { onAccessDenied } = this.props
    if (!this.isNavigatingAway) {
      this.isNavigatingAway = true
      return onAccessDenied()
    }
  }

  checkOwnership(wallet, assetId) {
    if (!isOwner(wallet, assetId)) {
      this.redirect()
    }
  }

  renderChildren(value) {
    const { wallet, children } = this.props

    return children(value, isOwner(wallet, value.id), wallet)
  }

  render() {
    const {
      value,
      isConnecting,
      ownerOnly,
      ownerNotAllowed,
      isLoading
    } = this.props

    if (!value || isLoading) {
      const shouldBeConnected = ownerOnly || ownerNotAllowed

      if (
        (shouldBeConnected && isConnecting) ||
        this.isNavigatingAway ||
        isLoading
      ) {
        return this.oldValue ? (
          this.renderChildren(this.oldValue)
        ) : (
          <div>
            <Loader active size="massive" />
          </div>
        )
      } else {
        return <NotFound />
      }
    }
    return this.renderChildren(value)
  }
}
