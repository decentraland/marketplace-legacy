import React from 'react'
import PropTypes from 'prop-types'
import { Loader } from 'semantic-ui-react'
import { walletType, parcelType } from 'components/types'
import { buildCoordinate } from 'lib/utils'

export default class Parcel extends React.PureComponent {
  static propTypes = {
    wallet: walletType.isRequired,
    parcel: parcelType,
    isConnecting: PropTypes.bool,
    isLoading: PropTypes.bool,
    ownerOnly: PropTypes.bool,
    ownerNotAllowed: PropTypes.bool,
    withPublications: PropTypes.bool,
    onAccessDenied: PropTypes.func.isRequired,
    children: PropTypes.func.isRequired
  }

  static defaultProps = {
    isConnecting: false,
    isLoading: false,
    ownerOnly: false,
    ownerNotAllowed: false,
    withPublications: false,
    parcel: null
  }

  constructor(props) {
    super(props)
    this.isNavigatingAway = false
  }

  componentWillMount() {
    const { isLoading, onFetchParcel } = this.props
    if (!isLoading) {
      onFetchParcel()
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      isConnecting,
      ownerOnly,
      wallet,
      ownerNotAllowed,
      withPublications,
      onAccessDenied,
      parcel
    } = nextProps

    const ownerIsNotAllowed = ownerNotAllowed && this.isOwner(wallet)
    const parcelShouldBeOnSale =
      withPublications && parcel && !parcel.publication

    if (!isConnecting) {
      if (ownerOnly) {
        this.checkOwnership(wallet)
      }

      if (ownerIsNotAllowed || parcelShouldBeOnSale) {
        return onAccessDenied()
      }
    }
  }

  checkOwnership(wallet) {
    const { onAccessDenied } = this.props
    if (!this.isNavigatingAway && !this.isOwner(wallet)) {
      this.isNavigatingAway = true
      return onAccessDenied()
    }
  }

  isOwner(wallet) {
    const { x, y } = this.props
    const parcelId = buildCoordinate(x, y)
    return !!wallet.parcelsById[parcelId]
  }

  render() {
    const { parcel, wallet, isConnecting, children } = this.props
    if (isConnecting || this.isNavigatingAway || !parcel) {
      return (
        <div>
          <Loader active size="massive" />
        </div>
      )
    }
    return children(parcel, this.isOwner(wallet))
  }
}
