import React from 'react'
import PropTypes from 'prop-types'

import {
  Menu,
  Container,
  Card,
  Dropdown,
  Pagination,
  Loader,
  Label
} from 'semantic-ui-react'
import AssetCard from 'components/AssetCard'
import { getTypeByMarketplaceTab } from 'modules/publication/utils'
import { parcelType, estateType } from 'components/types'
import { t } from '@dapps/modules/translation/utils'
import {
  getSortOptions,
  getOptionsFromSortType,
  getSortTypeFromOptions,
  buildUrl
} from './utils'
import { MARKETPLACE_PAGE_TABS } from 'locations'

import './MarketplacePage.css'

export default class MarketplacePage extends React.PureComponent {
  static propTypes = {
    assets: PropTypes.arrayOf(PropTypes.oneOfType([parcelType, estateType])),
    assetType: PropTypes.string.isRequired,
    page: PropTypes.number.isRequired,
    pages: PropTypes.number.isRequired,
    totals: PropTypes.object.isRequired,
    sortBy: PropTypes.string.isRequired,
    sortOrder: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    onNavigate: PropTypes.func.isRequired,
    onFetchPublications: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.sortOptions = getSortOptions()
  }

  componentWillMount() {
    this.fetchAllPublications()
  }

  componentWillReceiveProps(nextProps) {
    const { page, sortBy, sortOrder, assetType } = this.props
    if (
      page !== nextProps.page ||
      sortBy !== nextProps.sortBy ||
      sortOrder !== nextProps.sortOrder ||
      assetType !== nextProps.assetType
    ) {
      this.shouldFetchPublications = true
      this.scrollToTop()
    }
  }

  componentDidUpdate() {
    if (this.shouldFetchPublications) {
      this.props.onFetchPublications()
      this.shouldFetchPublications = false
    }
  }

  fetchAllPublications() {
    const { onFetchPublications } = this.props
    for (let tab in MARKETPLACE_PAGE_TABS) {
      const type = getTypeByMarketplaceTab(tab)
      onFetchPublications(type)
    }
  }

  scrollToTop() {
    window.scrollTo(0, 0)
  }

  navigateTo(options) {
    const navigationOptions = {
      ...this.props,
      ...options
    }
    const { onNavigate } = this.props
    const url = buildUrl(navigationOptions)
    onNavigate(url)
  }

  handlePageChange = (event, data) => {
    this.navigateTo({
      page: data.activePage
    })
  }

  handleSort = (event, data) => {
    if (this.props.isLoading) {
      return
    }
    const options = getOptionsFromSortType(data.value)
    this.navigateTo({
      ...options,
      page: 1
    })
  }

  renderLoading() {
    return <Loader active size="huge" />
  }

  renderEmpty() {
    return (
      <div className="empty">
        <p>{t('marketplace.empty')}</p>
      </div>
    )
  }

  renderPublications() {
    const { assets } = this.props
    return (
      <Card.Group stackable={true}>
        {assets.map((asset, index) => (
          <AssetCard key={asset.id} asset={asset} debounce={index * 100} />
        ))}
      </Card.Group>
    )
  }

  handleItemClick = (event, { name }) => {
    const { onNavigate } = this.props
    const url = buildUrl({
      page: 1,
      assetType: getTypeByMarketplaceTab(name)
    })
    onNavigate(url)
  }

  isActive(tab) {
    const assetType = getTypeByMarketplaceTab(tab)
    return assetType === this.props.assetType
  }

  renderBadge(total, tab) {
    return (
      <Label className={this.isActive(tab) ? 'active' : ''} size="tiny">
        {total.toLocaleString()}
      </Label>
    )
  }

  render() {
    const {
      page,
      pages,
      isLoading,
      isEmpty,
      sortBy,
      sortOrder,
      totals
    } = this.props
    const sortType = getSortTypeFromOptions({ sortBy, sortOrder })

    return (
      <div className="MarketplacePage">
        <Container>
          <Menu pointing secondary stackable>
            <Menu.Item
              name={MARKETPLACE_PAGE_TABS.parcels}
              active={this.isActive(MARKETPLACE_PAGE_TABS.parcels)}
              onClick={this.handleItemClick}
            >
              {t('global.parcels')}
              {this.renderBadge(totals.parcel, MARKETPLACE_PAGE_TABS.parcels)}
            </Menu.Item>
            <Menu.Item
              name={MARKETPLACE_PAGE_TABS.estates}
              active={this.isActive(MARKETPLACE_PAGE_TABS.estates)}
              onClick={this.handleItemClick}
            >
              {t('global.estates')}
              {this.renderBadge(totals.estate, MARKETPLACE_PAGE_TABS.estates)}
            </Menu.Item>
            <Menu.Menu position="right">
              <Menu.Item>
                <Dropdown
                  placeholder="Sort"
                  selection
                  value={sortType}
                  options={this.sortOptions}
                  onChange={this.handleSort}
                />
              </Menu.Item>
            </Menu.Menu>
          </Menu>
        </Container>
        <Container className={`publications ${isLoading ? 'loading' : ''}`}>
          {isEmpty && !isLoading && this.renderEmpty()}
          {!isEmpty && !isLoading && this.renderPublications()}
          {isLoading && this.renderLoading()}
        </Container>
        <Container textAlign="center" className="pagination">
          {!isEmpty && pages > 1 ? (
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
            />
          ) : null}
        </Container>
      </div>
    )
  }
}
