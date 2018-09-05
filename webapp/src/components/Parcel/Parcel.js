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

  constructor(props) {
    super(props)
    this.shouldRefresh = false
  }

  componentWillReceiveProps(nextProps) {
    const { parcel } = this.props
    if (
      parcel &&
      nextProps.parcel &&
      (parcel.x !== nextProps.parcel.x || parcel.y !== nextProps.parcel.y)
    ) {
      this.shouldRefresh = true
    }
  }

  componentDidUpdate() {
    if (this.shouldRefresh) {
      this.props.onLoaded()
      this.shouldRefresh = false
    }
  }

  isConnected(address) {
    return address.parcel_ids && address.parcel_ids.length > 0
  }

  render() {
    const { parcel } = this.props
    return (
      <Asset value={parcel} isConnected={this.isConnected} {...this.props} />
    )
  }
}
