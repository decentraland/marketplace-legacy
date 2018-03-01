import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { Menu } from 'semantic-ui-react'
import Account from './Account'
import Icon from 'components/Icon'
import Badge from 'components/Badge'

import { walletType, coordsType } from 'components/types'
import { locations, NAVBAR_PAGES } from 'locations'

import './Navbar.css'

export default class Navbar extends React.PureComponent {
  static propTypes = {
    wallet: walletType,
    center: coordsType,
    activePage: PropTypes.oneOf(Object.values(NAVBAR_PAGES)),
    isLoading: PropTypes.bool,
    activityBadge: PropTypes.number
  }

  isConnected() {
    const { wallet } = this.props
    return !!wallet && !!wallet.address
  }

  handleItemClick = (event, data) => {
    const { wallet, center, onNavigate } = this.props
    switch (data.name) {
      case NAVBAR_PAGES.atlas: {
        onNavigate(locations.parcelMapDetail(center.x, center.y))
        return
      }
      case NAVBAR_PAGES.profile: {
        onNavigate(locations.profilePage(wallet.address))
        return
      }
      case NAVBAR_PAGES.marketplace: {
        onNavigate(locations.marketplace)
        return
      }
      case NAVBAR_PAGES.activity: {
        onNavigate(locations.activity)
        return
      }
      default:
        return
    }
  }

  renderActivityBadge() {
    const { activityBadge, activePage } = this.props

    if (activityBadge === 0) {
      return null
    }
    const isActive = activePage === NAVBAR_PAGES.activity
    return <Badge color={isActive ? 'white' : 'purple'}>{activityBadge}</Badge>
  }

  render() {
    const { wallet, activePage, isLoading } = this.props
    return (
      <div className="Navbar" role="navigation">
        <div className="navbar-header">
          <Link to={locations.root} className="navbar-logo">
            <span className="navbar-icon">
              <Icon
                name={isLoading ? 'decentraland-loading' : 'decentraland'}
                className="pull-left"
              />
            </span>
            <h1 className="pull-left hidden-xs">Decentraland</h1>
          </Link>
        </div>
        <div className="navbar-menu">
          <Menu secondary>
            <Menu.Item
              name="atlas"
              active={activePage === NAVBAR_PAGES.atlas}
              onClick={this.handleItemClick}
            >
              Atlas
            </Menu.Item>
            <Menu.Item
              name="marketplace"
              active={activePage === NAVBAR_PAGES.marketplace}
              onClick={this.handleItemClick}
            >
              Marketplace
            </Menu.Item>
            <Menu.Item
              name="profile"
              active={activePage === NAVBAR_PAGES.profile}
              onClick={this.handleItemClick}
            >
              My Land
            </Menu.Item>
            <Menu.Item
              name="activity"
              active={activePage === NAVBAR_PAGES.activity}
              onClick={this.handleItemClick}
            >
              Activity{this.renderActivityBadge()}
            </Menu.Item>
          </Menu>
        </div>
        <div className="navbar-account">
          <Account wallet={wallet} />
        </div>
      </div>
    )
  }
}
