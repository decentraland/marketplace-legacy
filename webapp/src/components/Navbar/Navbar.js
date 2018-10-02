import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Menu, Icon, Responsive, Sidebar, Label } from 'semantic-ui-react'

import { locations, NAVBAR_PAGES } from 'locations'
import Badge from 'components/Badge'
import { default as DecentralandIcon } from 'components/Icon'
import { walletType, coordsType } from 'components/types'
import { t } from '@dapps/modules/translation/utils'
import Account from './Account'

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
      [NAVBAR_PAGES.marketplace]: locations.marketplacePageDefault(),
      [NAVBAR_PAGES.profile]: locations.profilePageDefault(wallet.address),
      [NAVBAR_PAGES.activity]: locations.activity(),
      [NAVBAR_PAGES.signIn]: locations.signIn()
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
    this.setState({ toggle: !this.state.toggle })
    event.stopPropagation()
    event.nativeEvent.stopImmediatePropagation()
  }

  handleDocumentClick = () => {
    this.setState({ toggle: false })
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
        <Link to={locations.root()} className="navbar-logo">
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

  renderMenuItems() {
    const { activePage, activityBadge, isConnected } = this.props
    const navigationPaths = this.getNavigationPaths()
    return (
      <React.Fragment>
        <Responsive
          as={Menu.Item}
          {...Responsive.onlyMobile}
          className="close-sidebar"
        >
          <Icon name="close" />
        </Responsive>
        {this.renderMenuItem('atlas')}
        {this.renderMenuItem('marketplace')}
        {isConnected ? (
          <React.Fragment>
            {this.renderMenuItem('profile')}
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
  }

  renderMenuItem(key) {
    const { activePage } = this.props
    const navigationPaths = this.getNavigationPaths()

    return (
      <Menu.Item
        href={navigationPaths[NAVBAR_PAGES[key]]}
        active={activePage === NAVBAR_PAGES[key]}
        onClick={this.handleItemClick}
      >
        {t(`global.${key}`)}
      </Menu.Item>
    )
  }

  render() {
    const {
      wallet,
      activePage,
      isConnected,
      isConnecting,
      isStatic,
      isModal
    } = this.props
    const navigationPaths = this.getNavigationPaths()

    if (isStatic) {
      return this.renderStaticPage()
    }

    if (isModal) {
      return this.renderModalPage()
    }

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
            {this.renderMenuItems()}
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
              {this.renderMenuItems()}
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
