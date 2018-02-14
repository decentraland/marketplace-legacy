import React from 'react'
import PropTypes from 'prop-types'

import { Menu, Container, Card, Header, Dropdown } from 'semantic-ui-react'
import Publication from './Publication'
import Navbar from 'components/Navbar'

import { publicationType } from 'components/types'

import './MarketplacePage.css'

const sortOptions = [
  {
    text: 'Newest',
    value: 'newest'
  },
  {
    text: 'Cheapest',
    value: 'cheapest'
  },
  {
    text: 'Most expensive',
    value: 'most-expensive'
  },
  {
    text: 'Closest to expire',
    value: 'closest-to-expired'
  }
]

export default class MarketplacePage extends React.PureComponent {
  static propTypes = {
    publications: PropTypes.arrayOf(publicationType)
  }

  componentWillMount() {
    const { onConnect, onFetchPublications } = this.props
    onConnect()
    onFetchPublications()
  }

  render() {
    const { publications } = this.props

    return (
      <div className="MarketplacePage">
        <Navbar />
        <Container>
          <Header size="huge" textAlign="center" className="title">
            Marketplace
          </Header>
        </Container>
        <Container>
          <Menu pointing secondary>
            <Menu.Item name="Parcels" active onClick={this.handleItemClick} />
            <Menu.Menu position="right">
              <Menu.Item>
                <Dropdown placeholder="Sort" selection options={sortOptions} />
              </Menu.Item>
            </Menu.Menu>
          </Menu>
        </Container>
        <Container className="publications">
          <Card.Group>
            {publications.map(publication => (
              <Publication
                key={publication.tx_hash}
                publication={publication}
              />
            ))}
          </Card.Group>
        </Container>
      </div>
    )
  }
}
