import React from 'react'
import PropTypes from 'prop-types'
import { Loader } from 'semantic-ui-react'

import { ASSET_TYPES } from 'shared/asset'
import { bidType } from 'components/types'
import BidParcelPage from './BidParcelPage'
import BidEstatePage from './BidEstatePage'

export default class BidAssetPage extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    bid: bidType,
    assetType: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired
  }

  isAllowed = () =>
    this.props.authorization &&
    this.props.authorization.allowances.ERC721Bid.MANAToken > 0

  render() {
    const { assetType, isLoading } = this.props

    if (isLoading) {
      return (
        <div>
          <Loader active size="massive" />
        </div>
      )
    }

    const isAllowed = !!this.isAllowed()

    switch (assetType) {
      case ASSET_TYPES.parcel:
        return <BidParcelPage {...this.props} isAllowed={isAllowed} />
      case ASSET_TYPES.estate:
        return <BidEstatePage {...this.props} isAllowed={isAllowed} />
      default:
        return null
    }
  }
}
