import React from 'react'
import PropTypes from 'prop-types'
import { Loader } from 'semantic-ui-react'
import { walletType } from 'components/types'
import { isOwner } from 'shared/asset'

export default class Asset extends React.PureComponent {
  static propTypes = {
    wallet: walletType.isRequired,
    value: PropTypes.object,
    isConnecting: PropTypes.bool,
    isFetchingAsset: PropTypes.bool,
    isLoading: PropTypes.bool,
    ownerOnly: PropTypes.bool,
    ownerNotAllowed: PropTypes.bool,
    onAccessDenied: PropTypes.func.isRequired,
    withPublications: PropTypes.bool,
    children: PropTypes.func.isRequired
  }

  static defaultProps = {
    isConnecting: false,
    isFetchingAsset: false,
    isLoading: false,
    ownerOnly: false,
    ownerNotAllowed: false,
    withPublications: false,
    value: null,
    publication: null
  }

  constructor(props) {
    super(props)
    this.isNavigatingAway = false
    this.shouldRefresh = false
  }

  componentWillMount() {
    const { isLoading, onLoaded } = this.props
    if (isLoading) {
      return
    }

    onLoaded()
  }

  componentDidUpdate() {
    if (this.shouldRefresh) {
      this.props.onLoaded()
      this.shouldRefresh = false
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      value,
      isConnecting,
      isFetchingAsset,
      ownerOnly,
      wallet,
      ownerNotAllowed,
      withPublications
    } = nextProps

    const ownerIsNotAllowed =
      ownerNotAllowed && value && isOwner(wallet, value.id)
    const assetShouldBeOnSale =
      withPublications && value && !value['publication_tx_hash']

    if (isConnecting || isFetchingAsset) {
      return
    }

    if (ownerOnly) {
      this.checkOwnership(wallet, value.id)
    }

    if (ownerIsNotAllowed || assetShouldBeOnSale || !value) {
      this.redirect()
    }

    if (this.props.value && value && this.props.value.id !== value.id) {
      this.shouldRefresh = true
    }
  }

  redirect() {
    const { onAccessDenied } = this.props
    if (!this.isNavigatingAway) {
      this.isNavigatingAway = true
      return onAccessDenied()
    }
  }

  checkOwnership(wallet, assetId) {
    const { onAccessDenied } = this.props
    if (!this.isNavigatingAway && !isOwner(wallet, assetId)) {
      this.isNavigatingAway = true
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

    return (shouldBeConnected && isConnecting) ||
      this.isNavigatingAway ||
      !value ? (
      <div>
        <Loader active size="massive" />
      </div>
    ) : (
      children(value, isOwner(wallet, value.id), wallet)
    )
  }
}
