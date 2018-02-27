import React from 'react'
import PropTypes from 'prop-types'

import { format, shortenAddress } from 'lib/utils'

import WalletParcels from './WalletParcels'
import WalletContributions from './WalletContributions'

import Blockie from 'components/Blockie'
import Footer from './Footer'

import './ExpandedSidebar.css'

export default class ExpandedSidebar extends React.PureComponent {
  static propTypes = {
    address: PropTypes.string,
    balance: PropTypes.number
  }

  renderAddress() {
    const { address } = this.props
    if (!address) return null
    return (
      <div className="address">
        <Blockie seed={address} />
        {shortenAddress(address)}
      </div>
    )
  }

  renderBalance() {
    const { balance } = this.props
    return (
      <div className="balance">{balance === null ? '--' : format(balance)}</div>
    )
  }

  render() {
    return (
      <div className="ExpandedSidebar fadein">
        <div className="MarketplaceTitle">
          <h2>
            LAND Manager
            <div className="info">
              {this.renderAddress()}
              {this.renderBalance()}
            </div>
          </h2>
        </div>

        <WalletParcels />
        <WalletContributions />

        <Footer />
      </div>
    )
  }
}
