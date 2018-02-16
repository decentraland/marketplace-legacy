import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import { locations } from 'locations'
import { Dimmer, Loader, Container, Header, Grid } from 'semantic-ui-react'
import PublicationForm from './PublicationForm'
import Navbar from 'components/Navbar'

import { walletType, publicationType } from 'components/types'
import { buildCoordinate } from 'lib/utils'

import './PublishPage.css'

export default class PublishPage extends React.PureComponent {
  static propTypes = {
    publication: publicationType,
    wallet: walletType,
    isWalletLoading: PropTypes.bool,
    isAddressLoading: PropTypes.bool,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    onConnect: PropTypes.func.isRequired,
    onPublish: PropTypes.func.isRequired,
    onNavigate: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.onConnect()
  }

  componentWillUpdate(nextProps) {
    const isWalletLoading =
      this.props.isWalletLoading || nextProps.isWalletLoading

    if (!isWalletLoading && !nextProps.isAddressLoading) {
      this.checkParcelOwner(nextProps.wallet)
    }
  }

  checkParcelOwner(wallet) {
    const { x, y, onNavigate } = this.props
    const parcelId = buildCoordinate(x, y)

    if (!wallet.parcelsById[parcelId]) {
      return onNavigate(locations.marketplace)
    }
  }

  handlePublish = ({ price, expiresAt }) => {
    const { x, y, onPublish } = this.props

    onPublish({
      x,
      y,
      price,
      expiresAt
    })
  }

  handleConfirmation = () => {
    this.props.onNavigate(locations.activities)
  }

  isLoading() {
    const { isWalletLoading, isAddressLoading } = this.props
    return isWalletLoading || isAddressLoading
  }

  render() {
    const { publication, x, y } = this.props

    return (
      <div className="PublishPage">
        <Navbar />

        {this.isLoading() ? (
          <Dimmer active inverted>
            <Loader size="huge" />
          </Dimmer>
        ) : null}

        <Container text textAlign="center">
          <Header as="h2" size="huge" className="title">
            Publish LAND
          </Header>
          <p>
            Set a price and a expiration date for the LAND at&nbsp;
            <Link to={locations.parcelDetail(x, y)}>
              {x}, {y}
            </Link>
          </p>
        </Container>

        <br />

        <Container text>
          <Grid>
            <Grid.Column>
              <PublicationForm
                publication={publication}
                onPublish={this.handlePublish}
                onConfirm={this.handleConfirmation}
              />
            </Grid.Column>
          </Grid>
        </Container>
      </div>
    )
  }
}
