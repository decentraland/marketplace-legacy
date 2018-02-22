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
    onAccessDenied: PropTypes.func.isRequired,
    onConnect: PropTypes.func.isRequired,
    children: PropTypes.func.isRequired
  }

  static defaultProps = {
    isConnecting: false,
    isLoading: false,
    ownerOnly: false,
    parcel: null
  }

  constructor(props) {
    super(props)
    this.isNavigatingAway = false
  }

  componentWillMount() {
    const { onConnect, parcel, isLoading, onFetchParcel } = this.props
    onConnect()
    if (!parcel && !isLoading) {
      onFetchParcel()
    }
  }

  componentWillReceiveProps(nextProps) {
    const { isConnecting, ownerOnly, wallet } = nextProps

    if (!isConnecting && ownerOnly) {
      this.checkOwnership(wallet)
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
      return <Loader size="massive" />
    }
    return children(parcel, this.isOwner(wallet))
  }
}
