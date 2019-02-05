import React from 'react'
import PropTypes from 'prop-types'

import { ASSET_TYPES } from 'shared/asset'
import AcceptBidParcelPage from './AcceptBidParcelPage'
import AcceptBidEstatePage from './AcceptBidEstatePage'
import { bidType } from 'components/types'

export default class AcceptBidAssetPage extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    bid: bidType,
    onFetchBidById: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    assetType: PropTypes.string.isRequired,
    isConnected: PropTypes.bool,
    isLoading: PropTypes.bool.isRequired
  }

  componentWillMount() {
    const { bid, onFetchBidById } = this.props
    if (!bid) {
      onFetchBidById()
    }
  }

  render() {
    const { assetType, bid } = this.props
    if (!bid) {
      return null
    }

    switch (assetType) {
      case ASSET_TYPES.parcel:
        return <AcceptBidParcelPage {...this.props} />
      case ASSET_TYPES.estate:
        return <AcceptBidEstatePage {...this.props} />
      default:
        return null
    }
  }
}
