import React from 'react'
import PropTypes from 'prop-types'

import { ASSET_TYPES } from 'shared/asset'
import CancelBidParcelPage from './CancelBidParcelPage'
import CancelBidEstatePage from './CancelBidEstatePage'
import { bidType } from 'components/types'

export default class CancelBidAssetPage extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    bid: bidType,
    assetType: PropTypes.string.isRequired,
    isConnected: PropTypes.bool,
    isLoading: PropTypes.bool.isRequired,
    onConfirm: PropTypes.func.isRequired
  }

  isBidFetched = false

  componentWillReceiveProps(nextProps) {
    const { isConnected, isLoading, onFetchBidByAsset, bid } = nextProps

    if (!isConnected || isLoading || bid || this.isBidFetched) {
      return
    }

    this.isBidFetched = true

    onFetchBidByAsset()
  }

  handleConfirm = () => {
    const { bid, onConfirm } = this.props
    onConfirm(bid)
  }

  render() {
    const { assetType } = this.props

    switch (assetType) {
      case ASSET_TYPES.parcel:
        return (
          <CancelBidParcelPage
            {...this.props}
            handleConfirm={this.handleConfirm}
          />
        )
      case ASSET_TYPES.estate:
        return (
          <CancelBidEstatePage
            {...this.props}
            handleConfirm={this.handleConfirm}
          />
        )
      default:
        return null
    }
  }
}
