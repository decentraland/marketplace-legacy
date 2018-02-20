import React from 'react'
import PropTypes from 'prop-types'

import { locations } from 'locations'
import { Container, Header, Grid, Loader } from 'semantic-ui-react'
import PublicationForm from './PublicationForm'
import Navbar from 'components/Navbar'
import ParcelName from 'components/ParcelName'

import { walletType, publicationType, parcelType } from 'components/types'

import './PublishPage.css'

export default class PublishPage extends React.PureComponent {
  static propTypes = {
    publication: publicationType,
    wallet: walletType,
    parcel: parcelType,
    isLoading: PropTypes.bool,
    onConnect: PropTypes.func.isRequired,
    onPublish: PropTypes.func.isRequired,
    onNavigate: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    // Because this component is connected to the router and redirects on a
    // lifecycle method instead of via a user fired event, we need to avoid navigating multiple times
    this.navigatingAway = false
  }

  componentWillMount() {
    this.props.onConnect()
  }

  componentWillReceiveProps(nextProps) {
    const { isLoading, wallet } = nextProps

    if (!isLoading) {
      this.checkParcelOwner(wallet)
    }
  }

  checkParcelOwner(wallet) {
    const { parcel, onNavigate } = this.props

    if (parcel && !this.navigatingAway && !wallet.parcelsById[parcel.id]) {
      this.navigatingAway = true
      return onNavigate(locations.marketplace)
    }
  }

  handlePublish = ({ price, expiresAt }) => {
    const { parcel, onPublish } = this.props

    onPublish({
      x: parcel.x,
      y: parcel.y,
      price,
      expiresAt
    })
  }

  handleConfirmation = () => {
    this.props.onNavigate(locations.activity)
  }

  handleCancel = () => {
    const { parcel } = this.props
    this.props.onNavigate(locations.parcelDetail(parcel.x, parcel.y))
  }

  render() {
    const { publication, parcel, isLoading } = this.props

    return (
      <div className="PublishPage">
        <Navbar />

        {isLoading ? (
          <Loader size="huge" />
        ) : (
          <React.Fragment>
            <Container text textAlign="center">
              <Header as="h2" size="huge" className="title">
                List LAND for sale
              </Header>
              <p className="subtitle">
                Set a price and a expiration date for{' '}
                <ParcelName size="small" parcel={parcel} />
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
                    onCancel={this.handleCancel}
                  />
                </Grid.Column>
              </Grid>
            </Container>
          </React.Fragment>
        )}
      </div>
    )
  }
}
