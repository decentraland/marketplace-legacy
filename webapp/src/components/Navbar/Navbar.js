import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { locations, NAVBAR_PAGES } from 'locations'
import { Menu, Icon, Responsive, Sidebar, Label } from 'semantic-ui-react'
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
    isConnecting: PropTypes.bool,
    activityBadge: PropTypes.number,
    onBack: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.state = {
      toggle: false
    }
  }

  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick)
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

  handleToggle = event => {
    this.toggled = true
    this.setState({ toggle: !this.state.toggle })
    event.stopPropagation()
  }

  handleDocumentClick = () => {
    if (!this.toggled) {
      this.setState({ toggle: false })
    } else {
      this.toggled = false
    }
  }

  renderStaticPage() {
    return (
      <div className="Navbar" role="navigation">
        {this.renderLogoHeader()}
      </div>
    )
  }

  renderModalPage() {
    const { onBack } = this.props
    return (
      <div className="Navbar" role="navigation">
        <div className="navbar-header navbar-modal">
          <span className="navbar-back" onClick={onBack}>
            <Icon name="chevron left" size="large" className="back" />
          </span>
        </div>
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
    const {
      wallet,
      activePage,
      isConnected,
      isConnecting,
      isStatic,
      isModal,
      activityBadge
    } = this.props
    const navigationPaths = this.getNavigationPaths()

    if (isStatic) {
      return this.renderStaticPage()
    }

    if (isModal) {
      return this.renderModalPage()
    }

    const menuItems = (
      <React.Fragment>
        <Responsive
          as={Menu.Item}
          {...Responsive.onlyMobile}
          className="close-sidebar"
        >
          <Icon name="close" />
        </Responsive>
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
            <Responsive
              as={Menu.Item}
              maxWidth={Responsive.onlyTablet.minWidth}
              href={navigationPaths[NAVBAR_PAGES.activity]}
              active={activePage === NAVBAR_PAGES.activity}
              onClick={this.handleItemClick}
            >
              {t('global.activity')}
              {activityBadge > 0 ? (
                <Label size="large" className="activity-badge-mobile">
                  {activityBadge}
                </Label>
              ) : null}
            </Responsive>
          </React.Fragment>
        ) : null}
      </React.Fragment>
    )

    return (
      <div className="Navbar" role="navigation">
        {this.renderLogoHeader()}
        <div className="navbar-menu">
          <Responsive
            as={Menu}
            secondary
            stackable
            minWidth={Responsive.onlyTablet.minWidth}
          >
            {menuItems}
          </Responsive>
          <Responsive
            {...Responsive.onlyMobile}
            className="hamburger-wrapper"
            onClick={this.handleToggle}
          >
            <Icon name="content" size="large" className="hamburger" />
            {activePage}
          </Responsive>
          <Responsive {...Responsive.onlyMobile}>
            <Sidebar
              as={Menu}
              animation="overlay"
              width="wide"
              visible={this.state.toggle}
              vertical
            >
              {menuItems}
            </Sidebar>
          </Responsive>
        </div>
        <div className="navbar-account">
          {isConnected ? (
            <React.Fragment>
              <Responsive
                as={Menu}
                secondary
                className="activity-menu"
                minWidth={Responsive.onlyTablet.minWidth}
              >
                <Menu.Item
                  href={navigationPaths[NAVBAR_PAGES.activity]}
                  active={activePage === NAVBAR_PAGES.activity}
                  onClick={this.handleItemClick}
                >
                  <Icon name="bell" />
                  {this.renderActivityBadge()}
                </Menu.Item>
              </Responsive>
              <Account wallet={wallet} />
            </React.Fragment>
          ) : isConnecting ? (
            <Menu secondary>
              <Menu.Item>{t('global.connecting')}&hellip;</Menu.Item>
            </Menu>
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
