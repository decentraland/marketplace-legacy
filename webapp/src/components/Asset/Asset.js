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
    isLoading: PropTypes.bool,
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
    this.isNavigatingAway = false
  }

  componentWillMount() {
    const { isLoading, onLoaded } = this.props
    if (isLoading) {
      return
    }

    onLoaded()
  }

  componentWillReceiveProps(nextProps) {
    const {
      value,
      isConnecting,
      ownerOnly,
      wallet,
      ownerNotAllowed,
      withPublications,
      onAccessDenied
    } = nextProps

    const ownerIsNotAllowed = ownerNotAllowed && isOwner(wallet, value.id)
    const assetShouldBeOnSale = withPublications && value && !value.publication

    if (isConnecting) {
      return
    }

    if (ownerOnly) {
      this.checkOwnership(wallet, value.id)
    }

    if (ownerIsNotAllowed || assetShouldBeOnSale) {
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
    const { value, wallet, isConnecting, children } = this.props
    return isConnecting || this.isNavigatingAway || !value ? (
      <div>
        <Loader active size="massive" />
      </div>
    ) : (
      children(value, isOwner(wallet, value.id), wallet)
    )
  }
}
