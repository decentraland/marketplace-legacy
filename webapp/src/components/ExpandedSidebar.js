import React from 'react'
import { Link } from 'react-router-dom'

import Icon from './Icon'

import './ExpandedSidebar.css'

export default function ExpandedSidebar(props) {
  return (
    <div className="ExpandedSidebar fadein">
      <UserData />
      <Footer />
    </div>
  )
}

ExpandedSidebar.propTypes = {}

function UserData() {
  return (
    <div className="UserData">
      <h2>Your parcels</h2>
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
