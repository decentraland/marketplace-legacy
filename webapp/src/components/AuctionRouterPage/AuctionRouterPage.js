import React from 'react'
import PropTypes from 'prop-types'

import { hasAuctionFinished, hasAuctionStarted } from 'modules/auction/utils'
import AuctionPage from 'components/AuctionPage'
import AuctionFinishedPage from 'components/AuctionFinishedPage'
import AuctionSplash from 'components/AuctionSplash'

export default class AuctionRouterPage extends React.PureComponent {
  static proptypes = {
    onFetchAuctionParams: PropTypes.func.isRequired,
    isConnected: PropTypes.bool.isRequired,
    isConnecting: PropTypes.bool.isRequired
  }

  constructor(props) {
    super(props)
    this.hasFetchedParams = false
    this.state = {
      auctionFinished: false
    }
  }

  componentWillMount() {
    const { isConnected } = this.props
    if (isConnected) {
      this.fetchData()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isConnected) {
      this.fetchData()
    }
  }

  fetchData = async () => {
    this.fetchAuctionParams()
    const auctionFinished = await hasAuctionFinished()
    this.setState({ auctionFinished })
  }

  fetchAuctionParams() {
    if (!this.hasFetchedParams) {
      this.props.onFetchAuctionParams()
      this.hasFetchedParams = true
    }
  }

  render() {
    const { auctionFinished } = this.state

    if (!hasAuctionStarted()) {
      return <AuctionSplash />
    }

    if (auctionFinished) {
      return <AuctionFinishedPage />
    } else {
      return <AuctionPage />
    }
  }
}
