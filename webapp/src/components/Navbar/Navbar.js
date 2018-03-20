import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { locations, NAVBAR_PAGES } from 'locations'
import { Menu, Icon } from 'semantic-ui-react'
import Account from './Account'
import Badge from 'components/Badge'
import { default as DecentralandIcon } from 'components/Icon'

import { walletType, coordsType } from 'components/types'
import { t } from 'modules/translation/utils'

import './Navbar.css'

export default class Navbar extends React.PureComponent {
  static propTypes = {
    wallet: walletType,
    center: coordsType,
    activePage: PropTypes.oneOf(Object.values(NAVBAR_PAGES)),
    isLoading: PropTypes.bool,
    isConnected: PropTypes.bool,
    activityBadge: PropTypes.number
  }

  getNavigationPaths() {
    const { wallet, center } = this.props
    return {
      [NAVBAR_PAGES.atlas]: locations.parcelMapDetail(center.x, center.y),
      [NAVBAR_PAGES.profile]: locations.profilePage(wallet.address),
      [NAVBAR_PAGES.marketplace]: locations.marketplace,
      [NAVBAR_PAGES.activity]: locations.activity,
      [NAVBAR_PAGES.signIn]: locations.signIn
    }
  }

  renderActivityBadge() {
    const { activityBadge, activePage } = this.props
    const isActive = activePage === NAVBAR_PAGES.activity
    if (activityBadge === 0 || isActive) {
      return null
    }
    return <Badge color={isActive ? 'white' : 'purple'}>{activityBadge}</Badge>
  }

  handleItemClick = (event, data) => {
    if (data.href) this.props.onNavigate(data.href)
    event.preventDefault()
  }

  renderStaticPage() {
    return (
      <div className="Navbar" role="navigation">
        {this.renderLogoHeader()}
      </div>
    )
  }

  renderLogoHeader() {
    const { isLoading } = this.props
    return (
      <div className="navbar-header">
        <Link to={locations.root} className="navbar-logo">
          <span className="navbar-icon">
            <DecentralandIcon
              name={isLoading ? 'decentraland-loading' : 'decentraland'}
              className="pull-left"
            />
          </span>
        </Link>
      </div>
    )
  }

  render() {
    const { wallet, activePage, isConnected, isStatic } = this.props
    const navigationPaths = this.getNavigationPaths()

    if (isStatic) {
      return this.renderStaticPage()
    }

    return (
      <div className="Navbar" role="navigation">
        {this.renderLogoHeader()}
        <div className="navbar-menu">
          <Menu secondary stackable>
            <Menu.Item
              href={navigationPaths[NAVBAR_PAGES.atlas]}
              active={activePage === NAVBAR_PAGES.atlas}
              onClick={this.handleItemClick}
            >
              {t('global.atlas')}
            </Menu.Item>
            <Menu.Item
              href={navigationPaths[NAVBAR_PAGES.marketplace]}
              active={activePage === NAVBAR_PAGES.marketplace}
              onClick={this.handleItemClick}
            >
              {t('global.marketplace')}
            </Menu.Item>
            {isConnected ? (
              <React.Fragment>
                <Menu.Item
                  href={navigationPaths[NAVBAR_PAGES.profile]}
                  active={activePage === NAVBAR_PAGES.profile}
                  onClick={this.handleItemClick}
                >
                  {t('navbar.my_land')}
                </Menu.Item>
              </React.Fragment>
            ) : null}
          </Menu>
        </div>
        <div className="navbar-account">
          {isConnected ? (
            <React.Fragment>
              <Menu secondary className="activity-menu">
                <Menu.Item
                  href={navigationPaths[NAVBAR_PAGES.activity]}
                  active={activePage === NAVBAR_PAGES.activity}
                  onClick={this.handleItemClick}
                >
                  <Icon name="bell" />
                  {this.renderActivityBadge()}
                </Menu.Item>
              </Menu>
              <Account wallet={wallet} />
            </React.Fragment>
          ) : (
            <Menu secondary>
              <Menu.Item
                href={navigationPaths[NAVBAR_PAGES.signIn]}
                active={activePage === NAVBAR_PAGES.signIn}
                onClick={this.handleItemClick}
              >
                {t('global.sign_in')}
              </Menu.Item>
            </Menu>
          )}
        </div>
      </div>
    )
  }
}
