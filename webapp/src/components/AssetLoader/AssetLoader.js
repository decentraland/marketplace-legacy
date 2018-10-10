import React from 'react'
import PropTypes from 'prop-types'

import { parcelType, estateType } from 'components/types'
import Asset from 'components/Asset'
import { ASSET_TYPES } from 'shared/asset'

export default class AssetLoader extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    asset: PropTypes.oneOfType([parcelType, estateType]),
    assetType: PropTypes.string.isRequired,
    onAccessDenied: PropTypes.func.isRequired
  }

  static defaultProps = {
    asset: null
  }

  isConnected = address => {
    const { assetType } = this.props
    switch (assetType) {
      case ASSET_TYPES.parcel:
        return address.parcel_ids && address.parcel_ids.length > 0
      case ASSET_TYPES.estate:
        return address.estate_ids && address.estate_ids.length > 0
    }
  }

  render() {
    const { asset } = this.props
    return (
      <Asset value={asset} isConnected={this.isConnected} {...this.props} />
    )
  }
}
