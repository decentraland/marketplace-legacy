import React from 'react'
import PropTypes from 'prop-types'
import { Loader } from 'semantic-ui-react'
import { walletType, parcelType } from 'components/types'
import { isOwner } from 'modules/parcels/utils'

export default class Parcel extends React.PureComponent {
  static propTypes = {
    wallet: walletType.isRequired,
    parcel: parcelType,
    isConnecting: PropTypes.bool,
    isLoading: PropTypes.bool,
    ownerOnly: PropTypes.bool,
    onAccessDenied: PropTypes.func.isRequired,
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
    const { isLoading, onFetchParcel } = this.props
    if (!isLoading) {
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
    const { onAccessDenied, parcel } = this.props
    if (!this.isNavigatingAway && !isOwner(wallet, parcel.x, parcel.y)) {
      this.isNavigatingAway = true
      return onAccessDenied()
    }
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
    return children(parcel, isOwner(wallet, parcel.x, parcel.y), wallet)
  }
}
