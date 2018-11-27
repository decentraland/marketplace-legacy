import React from 'react'
import PropTypes from 'prop-types'

import { hasAuctionFinished } from 'modules/auction/utils'
import AuctionPage from 'components/AuctionPage'
import AuctionFinishedPage from 'components/AuctionFinishedPage'

export default class AuctionRoute extends React.PureComponent {
  static proptypes = {
    onFetchAuctionParams: PropTypes.func.isRequired,
    isConnected: PropTypes.bool.isRequired,
    isConnecting: PropTypes.bool.isRequired
  }

  constructor(props) {
    super(props)
    this.hasFetchedParams = false
    this.state = { auctionFinished: false }
  }

  async componentWillMount() {
    const { isConnected } = this.props
    if (isConnected) {
      this.fetchAuctionParams()
      const auctionFinished = await hasAuctionFinished()
      this.setState({ auctionFinished: auctionFinished })
    }
  }

  async componentWillReceiveProps(nextProps) {
    if (nextProps.isConnected) {
      this.fetchAuctionParams()
      const auctionFinished = await hasAuctionFinished()
      this.setState({ auctionFinished: auctionFinished })
    }
  }

  fetchAuctionParams() {
    if (!this.hasFetchedParams) {
      this.props.onFetchAuctionParams()
      this.hasFetchedParams = true
    }
  }

  render() {
    const { auctionFinished } = this.state
    return auctionFinished ? <AuctionFinishedPage /> : <AuctionPage />
  }
}
