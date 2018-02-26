import React from 'react'
import PropTypes from 'prop-types'

import {
  Menu,
  Container,
  Card,
  Pagination,
  Loader,
  Dimmer,
  Label
} from 'semantic-ui-react'
import AddressLink from 'components/AddressLink'
import Navbar from 'components/Navbar'
import Publication from 'components/MarketplacePage/Publication'
import Parcel from './Parcel'
import Contribution from './Contribution'
import { publicationType } from 'components/types'
import { PROFILE_PAGE_TABS } from 'locations'
import { buildUrl } from './utils'

import './ProfilePage.css'

export default class ProfilePage extends React.PureComponent {
  static propTypes = {
    publications: PropTypes.arrayOf(publicationType),
    page: PropTypes.number.isRequired,
    pages: PropTypes.number.isRequired,
    onNavigate: PropTypes.func.isRequired,
    onConnect: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { onConnect, onFetchAddress } = this.props
    onConnect()
    onFetchAddress()
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
    return (
      <Dimmer active inverted>
        <Loader size="huge" />
      </Dimmer>
    )
  }

  renderEmpty() {
    const { tab } = this.props
    return (
      <div className="empty">
        <p>This user has no {tab}</p>
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

  renderGrid() {
    const { grid, tab } = this.props
    switch (tab) {
      case PROFILE_PAGE_TABS.PARCELS: {
        return (
          <Card.Group stackable={true}>
            {grid.map(parcel => <Parcel key={parcel.id} parcel={parcel} />)}
          </Card.Group>
        )
      }
      case PROFILE_PAGE_TABS.CONTRIBUTIONS: {
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
      case PROFILE_PAGE_TABS.PUBLICATIONS: {
        return (
          <Card.Group stackable={true}>
            {grid.map(publication => (
              <Publication
                key={publication.tx_hash}
                publication={publication}
                isOwnerVisible={false}
              />
            ))}
          </Card.Group>
        )
      }
      default:
        return null
    }
  }

  renderBadge(array) {
    if (array.length === 0) {
      return null
    }
    return <Label size="tiny">{array.length}</Label>
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

  render() {
    const {
      address,
      tab,
      page,
      pages,
      isLoading,
      isEmpty,
      parcels,
      contributions,
      publications
    } = this.props
    return (
      <div className="ProfilePage">
        <Navbar />
        <Container textAlign="center">
          <AddressLink address={address} scale={8} />
        </Container>
        <Container>
          <Menu pointing secondary>
            <Menu.Item
              name={PROFILE_PAGE_TABS.PARCELS}
              active={tab === PROFILE_PAGE_TABS.PARCELS}
              onClick={this.handleItemClick}
            >
              Parcels{this.renderBadge(parcels)}
            </Menu.Item>
            <Menu.Item
              name={PROFILE_PAGE_TABS.CONTRIBUTIONS}
              active={tab === PROFILE_PAGE_TABS.CONTRIBUTIONS}
              onClick={this.handleItemClick}
            >
              Contributions{this.renderBadge(contributions)}
            </Menu.Item>
            <Menu.Item
              name={PROFILE_PAGE_TABS.PUBLICATIONS}
              active={tab === PROFILE_PAGE_TABS.PUBLICATIONS}
              onClick={this.handleItemClick}
            >
              On Sale{this.renderBadge(publications)}
            </Menu.Item>
          </Menu>
        </Container>
        <Container className="publications">
          {isEmpty && !isLoading ? this.renderEmpty() : null}
          {isLoading ? this.renderLoading() : this.renderGrid()}
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
