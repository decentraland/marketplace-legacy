import React from 'react'
import PropTypes from 'prop-types'
import { parcelType } from 'components/types'
import { isOwner } from 'modules/parcels/utils'
import Asset from 'components/Asset'

export default class Parcel extends React.PureComponent {
  static propTypes = {
    parcel: parcelType,
    onAccessDenied: PropTypes.func.isRequired,
    children: PropTypes.func.isRequired
  }

  static defaultProps = {
    parcel: null
  }

  isOwner = wallet => {
    const { parcel } = this.props
    if (!parcel) {
      return
    }

    return isOwner(wallet, parcel.x, parcel.y)
  }

  isConnected = address => {
    return !!address.parcel_ids
  }

  render() {
    const { parcel } = this.props
    return (
      <Asset
        value={parcel}
        isOwner={this.isOwner}
        isConnected={this.isConnected}
        {...this.props}
      />
    )
  }
}
