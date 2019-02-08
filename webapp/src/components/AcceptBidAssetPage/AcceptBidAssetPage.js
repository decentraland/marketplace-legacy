import React from 'react'
import PropTypes from 'prop-types'
import { Loader } from 'semantic-ui-react'

import { isOpen } from 'shared/listing'
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
    isConnected: PropTypes.bool.isRequired,
    isBidLoading: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired
  }

  componentWillMount() {
    const { bid, onFetchBidById } = this.props
    if (!bid) {
      onFetchBidById()
    }
  }

  componentWillUpdate(nextProps) {
    const { bid, isConnected, isLoading, isBidLoading } = nextProps
    if (isConnected && !bid && !isLoading && !isBidLoading) {
      return this.handleOnAccessDenied()
    }
  }

  handleConfirm = () => {
    const { bid, onConfirm } = this.props
    onConfirm(bid)
  }

  handleOnAccessDenied = () => {
    this.props.onCancel()
  }

  render() {
    const { assetType, bid, isLoading, isBidLoading } = this.props

    const bidIsOpen = isOpen(bid)

    if (isLoading || isBidLoading) {
      return (
        <div>
          <Loader active size="massive" />
        </div>
      )
    }

    if (!bid) {
      return null
    }

    switch (assetType) {
      case ASSET_TYPES.parcel:
        return (
          <AcceptBidParcelPage
            {...this.props}
            isOpen={bidIsOpen}
            handleConfirm={this.handleConfirm}
          />
        )
      case ASSET_TYPES.estate:
        return (
          <AcceptBidEstatePage
            {...this.props}
            isOpen={bidIsOpen}
            handleConfirm={this.handleConfirm}
          />
        )
      default:
        return null
    }
  }
}
