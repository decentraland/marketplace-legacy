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

import ParcelCard from 'components/ParcelCard'
import EstateCard from 'components/EstateCard'
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
    parcels: PropTypes.arrayOf(parcelType),
    estates: PropTypes.arrayOf(estateType),
    tab: PropTypes.string.isRequired,
    page: PropTypes.number.isRequired,
    pages: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
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
    this.props.onFetchPublications()
  }

  componentWillReceiveProps(nextProps) {
    const { page, sortBy, sortOrder } = this.props
    if (
      page !== nextProps.page ||
      sortBy !== nextProps.sortBy ||
      sortOrder !== nextProps.sortOrder
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

  renderEstatePublications() {
    const { estates } = this.props
    return (
      <Card.Group stackable={true}>
        {estates.map((estate, index) => (
          <EstateCard key={estate.id} estate={estate} debounce={index * 100} />
        ))}
      </Card.Group>
    )
  }

  renderParcelPublications() {
    const { parcels } = this.props
    return (
      <Card.Group stackable={true}>
        {parcels.map((parcel, index) => (
          <ParcelCard key={parcel.id} parcel={parcel} debounce={index * 100} />
        ))}
      </Card.Group>
    )
  }

  handleItemClick = (event, { name }) => {
    const { onNavigate } = this.props
    const url = buildUrl({
      page: 1,
      tab: name
    })
    onNavigate(url)
  }

  isActive(tab) {
    return tab === this.props.tab
  }

  render() {
    const {
      total,
      page,
      pages,
      isLoading,
      isEmpty,
      sortBy,
      sortOrder
    } = this.props
    const sortType = getSortTypeFromOptions({ sortBy, sortOrder })

    return (
      <div className="MarketplacePage">
        <Container>
          <Menu pointing secondary>
            <Menu.Item
              name={MARKETPLACE_PAGE_TABS.parcels}
              active={this.isActive(MARKETPLACE_PAGE_TABS.parcels)}
              onClick={this.handleItemClick}
            >
              {t('global.parcels')}
              <Label className="active" size="tiny">
                {total.toLocaleString()}
              </Label>
            </Menu.Item>
            <Menu.Item
              name={MARKETPLACE_PAGE_TABS.estates}
              active={this.isActive(MARKETPLACE_PAGE_TABS.estates)}
              onClick={this.handleItemClick}
            >
              {t('global.estates')}
              <Label className="active" size="tiny">
                {total.toLocaleString()}
              </Label>
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
          {!isEmpty &&
            !isLoading &&
            this.isActive(MARKETPLACE_PAGE_TABS.parcels) &&
            this.renderParcelPublications()}
          {!isEmpty &&
            !isLoading &&
            this.isActive(MARKETPLACE_PAGE_TABS.estates) &&
            this.renderEstatePublications()}
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
