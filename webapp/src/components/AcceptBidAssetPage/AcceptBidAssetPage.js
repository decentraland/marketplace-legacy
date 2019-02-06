import React from 'react'
import PropTypes from 'prop-types'
import { Loader } from 'semantic-ui-react'

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

  handleConfirm = () => {
    const { bid, onConfirm } = this.props
    onConfirm(bid)
  }

  render() {
    const { assetType, bid, isLoading } = this.props

    if (!bid) {
      return null
    }

    if (isLoading) {
      return (
        <div>
          <Loader active size="massive" />
        </div>
      )
    }

    switch (assetType) {
      case ASSET_TYPES.parcel:
        return (
          <AcceptBidParcelPage
            {...this.props}
            handleConfirm={this.handleConfirm}
          />
        )
      case ASSET_TYPES.estate:
        return (
          <AcceptBidEstatePage
            {...this.props}
            handleConfirm={this.handleConfirm}
          />
        )
      default:
        return null
    }
  }
}
