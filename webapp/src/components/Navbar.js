import React from 'react'
import { Link } from 'react-router-dom'

import locations from '../locations'

import Icon from './Icon'

import './Navbar.css'

export default function Navbar() {
  return (
    <div className="navbar" role="navigation">
      <div className="navbar-header">
        <Link to="/" className="navbar-logo">
          <Icon name="decentraland" className="pull-left" />
          <h1 className="pull-left hidden-xs">Decentraland</h1>
        </Link>
      </div>
      <div id="navbar" className="navbar-container">
        <ul className="nav navbar-nav navbar-right">
          <li>
            <Link to={locations.root}>Auction</Link>
          </li>

          <li>
            <Link to={locations.stats}>Stats</Link>
          </li>

          <li>
            <Link to={locations.faq}>FAQ</Link>
          </li>

          <li>
            <Link to="https://blog.decentraland.org" target="_blank">
              Blog
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
