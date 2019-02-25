import React from 'react'
import PropTypes from 'prop-types'
import { Loader, Container, Message } from 'semantic-ui-react'
import { t } from '@dapps/modules/translation/utils'

import { isOpen } from 'shared/listing'
import { ASSET_TYPES } from 'shared/asset'
import { fetchMANABalance } from 'modules/wallet/utils'
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

  bidderBalanceFetched = false

  constructor(props) {
    super(props)
    this.state = { bidderHasBalance: true }
  }

  componentWillMount() {
    const { bid, onFetchBidById } = this.props
    if (!bid) {
      onFetchBidById()
    } else {
      this.fetchBidderBalance(bid)
    }
  }

  componentWillUpdate(nextProps) {
    const { bid, isConnected, isLoading, isBidLoading } = nextProps
    if (isConnected && !bid && !isLoading && !isBidLoading) {
      return this.handleOnAccessDenied()
    }

    if (bid && isConnected && !this.bidderBalanceFetched) {
      this.fetchBidderBalance(bid)
    }
  }

  async fetchBidderBalance(bid) {
    const { bidder, price } = bid

    const balance = await fetchMANABalance(bidder)

    this.bidderBalanceFetched = true

    this.setState({
      bidderHasBalance: parseInt(balance, 10) >= parseInt(price, 10)
    })
  }

  handleConfirm = () => {
    const { bid, onConfirm } = this.props
    onConfirm(bid)
  }

  handleOnAccessDenied = () => {
    this.props.onCancel()
  }

  renderAcceptBidComponent() {
    const { bidderHasBalance } = this.state
    const { assetType, bid } = this.props

    const isBidOpen = isOpen(bid)

    switch (assetType) {
      case ASSET_TYPES.parcel:
        return (
          <AcceptBidParcelPage
            {...this.props}
            isOpen={isBidOpen}
            handleConfirm={this.handleConfirm}
            bidderHasBalance={bidderHasBalance}
          />
        )
      case ASSET_TYPES.estate:
        return (
          <AcceptBidEstatePage
            {...this.props}
            isOpen={isBidOpen}
            handleConfirm={this.handleConfirm}
            bidderHasBalance={bidderHasBalance}
          />
        )
      default:
        return null
    }
  }

  render() {
    const { bidderHasBalance } = this.state
    const { bid, isLoading, isBidLoading } = this.props

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

    return (
      <div>
        {!bidderHasBalance && (
          <Container text>
            <Message
              warning
              icon="warning sign"
              header={t('global.warning')}
              content={t('asset_bid.insufficient_funds')}
            />
          </Container>
        )}
        {this.renderAcceptBidComponent()}
      </div>
    )
  }
}
