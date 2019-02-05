import React from 'react'
import PropTypes from 'prop-types'

import { ASSET_TYPES } from 'shared/asset'
import { bidType } from 'components/types'
import BidParcelPage from './BidParcelPage'
import BidEstatePage from './BidEstatePage'

export default class BidAssetPage extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    bid: bidType,
    assetType: PropTypes.string.isRequired
  }

  render() {
    const { assetType } = this.props

    switch (assetType) {
      case ASSET_TYPES.parcel:
        return <BidParcelPage {...this.props} />
      case ASSET_TYPES.estate:
        return <BidEstatePage {...this.props} />
      default:
        return null
    }
  }
}
