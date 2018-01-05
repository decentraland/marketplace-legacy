import React from 'react'
import PropTypes from 'prop-types'

import { shortenAddress } from '../lib/utils'

import UserParcels from './UserParcels'

import Icon from './Icon'
import Footer from './Footer'

import './ExpandedSidebar.css'

export default function ExpandedSidebar({ address }) {
  return (
    <div className="ExpandedSidebar fadein">
      <div className="MarketplaceTitle">
        <h2>
          Marketplace
          {address && (
            <div className="address">
              <Icon name="address" />
              {shortenAddress(address)}
            </div>
          )}
        </h2>
      </div>

      <UserParcels />

      <Footer />
    </div>
  )
}

ExpandedSidebar.propTypes = {
  address: PropTypes.string
}
