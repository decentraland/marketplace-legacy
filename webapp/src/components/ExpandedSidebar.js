import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { shortenAddress } from '../lib/utils'

import UserParcelsContainer from '../containers/UserParcelsContainer'

import Icon from './Icon'

import './ExpandedSidebar.css'

export default function ExpandedSidebar({ address }) {
  return (
    <div className="ExpandedSidebar fadein">
      <MarketplaceTitle address={address} />

      <UserParcelsContainer />

      <Footer />
    </div>
  )
}

ExpandedSidebar.propTypes = {
  address: PropTypes.string
}

function MarketplaceTitle({ address }) {
  return (
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
  )
}

function Footer() {
  return (
    <footer className="Footer">
      <div className="social-icons">
        <Link to="https://twitter.com/decentraland/" target="_blank">
          <Icon name="twitter" />
        </Link>
        <Link to="https://chat.decentraland.org/" target="_blank">
          <Icon name="rocketchat" />
        </Link>
        <Link to="https://github.com/decentraland/" target="_blank">
          <Icon name="github" />
        </Link>
        <Link to="https://reddit.com/r/decentraland/" target="_blank">
          <Icon name="reddit" />
        </Link>
        <Link to="https://www.facebook.com/decentraland/" target="_blank">
          <Icon name="facebook" />
        </Link>
      </div>
      <div className="links">
        <Link to="https://blog.decentraland.org" target="_blank">
          Blog
        </Link>
        <Link to="https://decentraland.org" target="_blank">
          Website
        </Link>
        <Link to="https://decentraland.org/whitepaper.pdf" target="_blank">
          Whitepaper
        </Link>
      </div>
      <div className="copyright">
        Copyright 2017 Decentraland. All rights reserved.
      </div>
    </footer>
  )
}
