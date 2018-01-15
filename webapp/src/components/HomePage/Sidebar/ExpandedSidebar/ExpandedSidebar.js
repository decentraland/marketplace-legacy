import React from 'react'
import PropTypes from 'prop-types'

import { shortenAddress } from 'lib/utils'

import WalletParcels from './WalletParcels'
import WalletContributions from './WalletContributions'

import Icon from 'components/Icon'
import Footer from './Footer'

import './ExpandedSidebar.css'

export default class ExpandedSidebar extends React.PureComponent {
  static propTypes = {
    address: PropTypes.string
  }

  render() {
    const { address } = this.props
    return (
      <div className="ExpandedSidebar fadein">
        <div className="MarketplaceTitle">
          <h2>
            Land Manager
            {address && (
              <div className="address">
                <Icon name="address" />
                {shortenAddress(address)}
              </div>
            )}
          </h2>
        </div>

        <WalletParcels />
        <WalletContributions />

        <Footer />
      </div>
    )
  }
}
