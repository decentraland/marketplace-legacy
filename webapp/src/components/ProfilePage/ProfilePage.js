import React from 'react'
import PropTypes from 'prop-types'
import {
  Menu,
  Container,
  Card,
  Pagination,
  Loader,
  Label
} from 'semantic-ui-react'
import { t } from '@dapps/modules/translation/utils'

import { buildUrl } from './utils'
import Contribution from './Contribution'
import { PROFILE_PAGE_TABS } from 'locations'
import { isFeatureEnabled } from 'lib/featureUtils'
import { shortenAddress, isBlacklistedAddress } from 'lib/utils'
import {
  parcelType,
  contributionType,
  estateType,
  assetType,
  bidType
} from 'components/types'
import AddressBlock from 'components/AddressBlock'
import AssetCard from 'components/AssetCard'
import BidCard from 'components/BidCard'
import { getBidsByReceivedAndPlaced } from 'modules/bid/utils'

import './ProfilePage.css'

export default class ProfilePage extends React.PureComponent {
  static propTypes = {
    address: PropTypes.string,
    parcels: PropTypes.arrayOf(parcelType),
    estates: PropTypes.arrayOf(estateType),
    contributions: PropTypes.arrayOf(contributionType),
    publishedAssets: PropTypes.arrayOf(assetType),
    mortgagedParcels: PropTypes.arrayOf(parcelType),
    grid: PropTypes.arrayOf(
      PropTypes.oneOfType([parcelType, contributionType])
    ),
    tab: PropTypes.string,
    page: PropTypes.number.isRequired,
    pages: PropTypes.number.isRequired,
    isLoading: PropTypes.bool,
    isEmpty: PropTypes.bool,
    isOwner: PropTypes.bool,
    isConnecting: PropTypes.bool,
    onNavigate: PropTypes.func.isRequired,
    bids: PropTypes.arrayOf(bidType)
  }

  componentWillMount() {
    const { address, onAccessDenied } = this.props
    if (isBlacklistedAddress(address)) {
      onAccessDenied()
    }
    this.props.onFetchAddress()
  }

  componentWillReceiveProps(nextProps) {
    const { isLoading, isOwner, address } = nextProps

    if (address !== this.props.address) {
      this.props.onFetchAddress(address)
    }

    if (!isLoading && !isOwner && this.onlyOwnerCanAccess()) {
      this.handleAddressChange(address)
    }
  }

  handleAddressChange = address => {
    const url = buildUrl({
      page: 1,
      address,
      tab: PROFILE_PAGE_TABS.parcels
    })
    this.props.onNavigate(url)
  }

  handlePageChange = (event, data) => {
    const { address, tab, onNavigate } = this.props
    const url = buildUrl({
      page: data.activePage,
      address,
      tab
    })
    onNavigate(url)
  }

  renderLoading() {
    return <Loader active size="huge" />
  }

  renderEmpty() {
    const { tab } = this.props
    return (
      <div className="empty">
        <p>
          {t('profile_page.empty', {
            content: t(`global.${tab}`).toLowerCase()
          })}
        </p>
      </div>
    )
  }

  renderGrid() {
    const { grid, tab, address } = this.props
    switch (tab) {
      case PROFILE_PAGE_TABS.parcels: {
        return (
          <Card.Group stackable={true}>
            {grid.map(asset => <AssetCard key={asset.id} asset={asset} />)}
          </Card.Group>
        )
      }
      case PROFILE_PAGE_TABS.contributions: {
        return (
          <Card.Group stackable={true}>
            {grid.map(contribution => (
              <Contribution
                key={contribution.district_id}
                contribution={contribution}
              />
            ))}
          </Card.Group>
        )
      }
      case PROFILE_PAGE_TABS.publications: {
        return (
          <Card.Group stackable={true}>
            {grid.map(asset => (
              <AssetCard key={asset.id} asset={asset} isOwnerVisible={false} />
            ))}
          </Card.Group>
        )
      }
      case PROFILE_PAGE_TABS.estates: {
        return (
          <Card.Group stackable={true}>
            {grid.map(estate => <AssetCard key={estate.id} asset={estate} />)}
          </Card.Group>
        )
      }
      case PROFILE_PAGE_TABS.bids:
      case PROFILE_PAGE_TABS.archivebids: {
        const [bidsReceived, bidsPlaced] = getBidsByReceivedAndPlaced(
          grid,
          address
        )

        return (
          <React.Fragment>
            <a
              className="archive-toggle-title"
              onClick={() =>
                this.handleItemClick(null, {
                  name: this.isActive(PROFILE_PAGE_TABS.bids)
                    ? PROFILE_PAGE_TABS.archivebids
                    : PROFILE_PAGE_TABS.bids
                })
              }
            >
              {this.isActive(PROFILE_PAGE_TABS.bids)
                ? t('bid.see_archived')
                : t('bid.see_all')}
            </a>
            {bidsReceived.length > 0 && (
              <React.Fragment>
                <h3 className="bids-title">{t('bid.received')}</h3>
                <Card.Group stackable={true}>
                  {bidsReceived.map(bid => (
                    <BidCard
                      key={bid.id}
                      bid={bid}
                      isOwner={address === bid.seller}
                    />
                  ))}
                </Card.Group>
              </React.Fragment>
            )}

            {bidsPlaced.length > 0 && (
              <React.Fragment>
                <h3 className="bids-title placed">{t('bid.placed')}</h3>
                <Card.Group stackable={true}>
                  {bidsPlaced.map(bid => (
                    <BidCard
                      key={bid.id}
                      bid={bid}
                      isOwner={address === bid.seller}
                    />
                  ))}
                </Card.Group>
              </React.Fragment>
            )}
          </React.Fragment>
        )
      }
      case PROFILE_PAGE_TABS.mortgages: {
        return (
          <Card.Group stackable={true}>
            {grid.map(parcel => (
              <AssetCard
                key={parcel.id}
                asset={parcel}
                isOwnerVisible={false}
                showMortgage={true}
              />
            ))}
          </Card.Group>
        )
      }
      default:
        return null
    }
  }

  isActive(tab) {
    return tab === this.props.tab
  }

  renderBadge(array, tab) {
    if (array.length === 0) {
      return null
    }
    return (
      <Label className={this.isActive(tab) ? 'active' : ''} size="tiny">
        {array.length}
      </Label>
    )
  }

  renderBidBadge(bids) {
    if (this.isActive(PROFILE_PAGE_TABS.bids)) {
      return this.renderBadge(bids, PROFILE_PAGE_TABS.bids)
    }

    if (this.isActive(PROFILE_PAGE_TABS.archivebids)) {
      return this.renderBadge(bids, PROFILE_PAGE_TABS.archivebids)
    }

    return this.renderBadge(bids, '')
  }

  handleItemClick = (event, { name }) => {
    const { address, onNavigate } = this.props
    const url = buildUrl({
      page: 1,
      address,
      tab: name
    })
    onNavigate(url)
  }

  onlyOwnerCanAccess = () =>
    this.isActive(PROFILE_PAGE_TABS.bids) ||
    this.isActive(PROFILE_PAGE_TABS.mortgages)

  isBidActive() {
    return (
      this.isActive(PROFILE_PAGE_TABS.bids) ||
      this.isActive(PROFILE_PAGE_TABS.archivebids)
    )
  }

  render() {
    const {
      address,
      page,
      pages,
      isLoading,
      isEmpty,
      parcels,
      contributions,
      publishedAssets,
      estates,
      mortgagedParcels,
      isOwner,
      isConnecting,
      bids
    } = this.props

    return (
      <div className="ProfilePage">
        {isOwner || isConnecting ? null : (
          <Container className="profile-header">
            <div>
              <AddressBlock scale={16} address={address} hasTooltip={false} />
              <span className="profile-address">{shortenAddress(address)}</span>
            </div>
          </Container>
        )}
        <Container className="profile-menu">
          <Menu pointing secondary stackable>
            <Menu.Item
              name={PROFILE_PAGE_TABS.parcels}
              active={this.isActive(PROFILE_PAGE_TABS.parcels)}
              onClick={this.handleItemClick}
            >
              {t('global.parcels')}
              {this.renderBadge(parcels, PROFILE_PAGE_TABS.parcels)}
            </Menu.Item>
            <Menu.Item
              name={PROFILE_PAGE_TABS.contributions}
              active={this.isActive(PROFILE_PAGE_TABS.contributions)}
              onClick={this.handleItemClick}
            >
              {t('global.contributions')}
              {this.renderBadge(contributions, PROFILE_PAGE_TABS.contributions)}
            </Menu.Item>
            <Menu.Item
              name={PROFILE_PAGE_TABS.publications}
              active={this.isActive(PROFILE_PAGE_TABS.publications)}
              onClick={this.handleItemClick}
            >
              {t('profile_page.on_sale')}
              {this.renderBadge(
                publishedAssets,
                PROFILE_PAGE_TABS.publications
              )}
            </Menu.Item>
            <Menu.Item
              name={PROFILE_PAGE_TABS.estates}
              active={this.isActive(PROFILE_PAGE_TABS.estates)}
              onClick={this.handleItemClick}
            >
              {t('global.estates')}
              {this.renderBadge(estates, PROFILE_PAGE_TABS.estates)}
            </Menu.Item>
            {isOwner && (
              <React.Fragment>
                {isFeatureEnabled('BIDS') && (
                  <Menu.Item
                    name={PROFILE_PAGE_TABS.bids}
                    active={this.isBidActive()}
                    onClick={this.handleItemClick}
                  >
                    {t('global.bids')}
                    {this.renderBidBadge(bids)}
                  </Menu.Item>
                )}

                <Menu.Item
                  name={PROFILE_PAGE_TABS.mortgages}
                  active={this.isActive(PROFILE_PAGE_TABS.mortgages)}
                  onClick={this.handleItemClick}
                >
                  {t('global.mortgages')}
                  {this.renderBadge(
                    mortgagedParcels,
                    PROFILE_PAGE_TABS.mortgages
                  )}
                </Menu.Item>
              </React.Fragment>
            )}
          </Menu>
        </Container>
        <Container className="profile-grid">
          {isLoading ? this.renderLoading() : this.renderGrid()}
          {isEmpty && !isLoading ? this.renderEmpty() : null}
        </Container>
        <Container textAlign="center" className="pagination">
          {isEmpty || pages <= 1 ? null : (
            <Pagination
              activePage={page}
              firstItem={null}
              lastItem={null}
              prevItem={null}
              nextItem={null}
              pointing
              secondary
              totalPages={pages}
              onPageChange={this.handlePageChange}
              boundaryRange={1}
              siblingRange={1}
            />
          )}
        </Container>
      </div>
    )
  }
}
