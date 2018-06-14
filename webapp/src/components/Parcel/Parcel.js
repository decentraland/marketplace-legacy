import React from 'react'
import PropTypes from 'prop-types'
import { parcelType } from 'components/types'
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

  isConnected(address) {
    return !!address.parcel_ids
  }

  render() {
    const { parcel } = this.props
    return (
      <Asset value={parcel} isConnected={this.isConnected} {...this.props} />
    )
  }
}
