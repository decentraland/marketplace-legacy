import React from 'react'
import PropTypes from 'prop-types'
import { estateType } from 'components/types'
import { isOwner } from 'modules/parcels/utils'
import Asset from 'components/Asset'

export default class Parcel extends React.PureComponent {
  static propTypes = {
    estate: estateType,
    onAccessDenied: PropTypes.func.isRequired,
    children: PropTypes.func.isRequired
  }

  static defaultProps = {
    estate: null
  }

  isOwner = wallet => {
    const { estate } = this.props
    if (!estate) {
      return
    }

    return wallet.address === estate.owner
  }

  isConnected = address => {
    return !!address.estate_ids
  }

  render() {
    const { estate } = this.props
    return (
      <Asset
        value={estate}
        isOwner={this.isOwner}
        isConnected={this.isConnected}
        {...this.props}
      />
    )
  }
}
