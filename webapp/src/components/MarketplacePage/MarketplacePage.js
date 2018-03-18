import React from 'react'
import PropTypes from 'prop-types'

import {
  Menu,
  Container,
  Card,
  Dropdown,
  Pagination,
  Loader,
  Dimmer
} from 'semantic-ui-react'
import Publication from './Publication'

import { publicationType } from 'components/types'
import { t } from 'modules/translation/utils'

import {
  getSortOptions,
  getOptionsFromSortType,
  getSortTypeFromOptions,
  buildUrl
} from './utils'

import './MarketplacePage.css'

export default class MarketplacePage extends React.PureComponent {
  static propTypes = {
    publications: PropTypes.arrayOf(publicationType),
    page: PropTypes.number.isRequired,
    pages: PropTypes.number.isRequired,
    sortBy: PropTypes.string.isRequired,
    sortOrder: PropTypes.string.isRequired,
    onNavigate: PropTypes.func.isRequired,
    onFetchPublications: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.sortOptions = getSortOptions()
  }

  componentWillMount() {
    const { onFetchPublications } = this.props
    onFetchPublications()
  }

  componentWillReceiveProps(nextProps) {
    const { page, sortBy, sortOrder } = this.props
    if (
      page !== nextProps.page ||
      sortBy !== nextProps.sortBy ||
      sortOrder !== nextProps.sortOrder
    ) {
      this.shouldFetchPublications = true
    }
  }

  componentDidUpdate() {
    if (this.shouldFetchPublications) {
      this.props.onFetchPublications()
      this.shouldFetchPublications = false
    }
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
    this.navigateTo(options)
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
    const { publications } = this.props
    return (
      <Card.Group stackable={true}>
        {publications.map((publication, index) => (
          <Publication
            key={publication.tx_hash}
            publication={publication}
            debounce={index * 100}
          />
        ))}
      </Card.Group>
    )
  }

  render() {
    const { page, pages, isLoading, isEmpty, sortBy, sortOrder } = this.props
    const sortType = getSortTypeFromOptions({ sortBy, sortOrder })

    return (
      <div className="MarketplacePage">
        <Container>
          <Menu pointing secondary>
            <Menu.Item
              name={t('global.parcels')}
              active
              onClick={this.handleItemClick}
            />
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
          {isEmpty && !isLoading
            ? this.renderEmpty()
            : this.renderPublications()}
          {isLoading ? this.renderLoading() : null}
        </Container>
        <Container textAlign="center" className="pagination">
          {isEmpty || pages <= 1 ? null : (
            <Pagination
              activePage={page}
              firstItem={null}
              lastItem={null}
              pointing
              secondary
              totalPages={pages}
              onPageChange={this.handlePageChange}
            />
          )}
        </Container>
      </div>
    )
  }
}
