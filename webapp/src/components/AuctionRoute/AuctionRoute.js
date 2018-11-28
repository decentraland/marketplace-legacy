import React from 'react'
import PropTypes from 'prop-types'

import { hasAuctionFinished, hasAuctionStarted } from 'modules/auction/utils'
import AuctionPage from 'components/AuctionPage'
import AuctionFinishedPage from 'components/AuctionFinishedPage'
import AuctionSplash from 'components/AuctionSplash'

export default class AuctionRoute extends React.PureComponent {
  static proptypes = {
    onFetchAuctionParams: PropTypes.func.isRequired,
    isConnected: PropTypes.bool.isRequired,
    isConnecting: PropTypes.bool.isRequired
  }

  constructor(props) {
    super(props)
    this.hasFetchedParams = false
    this.state = {
      auctionFinished: false,
      auctionHasStarted: true
    }
  }

  async componentWillMount() {
    const { isConnected } = this.props
    if (isConnected) {
      this.fetchAuctionParams()
      const auctionFinished = await hasAuctionFinished()
      const auctionHasStarted = hasAuctionStarted()
      this.setState({
        auctionFinished,
        auctionHasStarted
      })
    }
  }

  async componentWillReceiveProps(nextProps) {
    if (nextProps.isConnected) {
      this.fetchAuctionParams()
      const auctionFinished = await hasAuctionFinished()
      const auctionHasStarted = hasAuctionStarted()
      this.setState({
        auctionFinished,
        auctionHasStarted
      })
    }
  }

  fetchAuctionParams() {
    if (!this.hasFetchedParams) {
      this.props.onFetchAuctionParams()
      this.hasFetchedParams = true
    }
  }

  render() {
    const { auctionFinished, auctionHasStarted } = this.state

    if (!auctionHasStarted) {
      return <AuctionSplash />
    }

    if (auctionFinished) {
      return <AuctionFinishedPage />
    } else {
      return <AuctionPage />
    }
  }
}
