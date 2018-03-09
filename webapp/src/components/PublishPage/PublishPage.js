import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Container, Header, Grid, Message } from 'semantic-ui-react'
import PublicationForm from './PublicationForm'
import Navbar from 'components/Navbar'
import ParcelName from 'components/ParcelName'
import Parcel from 'components/Parcel'
import TxStatus from 'components/TxStatus'

import { publicationType, walletType } from 'components/types'
import { locations } from 'locations'

import './PublishPage.css'

export default class PublishPage extends React.PureComponent {
  static propTypes = {
    publication: publicationType,
    wallet: walletType,
    isTxIdle: PropTypes.bool.isRequired,
    onPublish: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  }

  render() {
    const {
      wallet,
      x,
      y,
      publication,
      isTxIdle,
      onPublish,
      onCancel
    } = this.props

    const { isLandAuthorized } = wallet

    return (
      <div className="PublishPage">
        <Navbar />
        <Parcel x={x} y={y} ownerOnly>
          {parcel => (
            <React.Fragment>
              <Container text textAlign="center">
                <Header as="h2" size="huge" className="title">
                  List LAND for sale
                </Header>
                <span className="subtitle">
                  Set a price and a expiration date for{' '}
                  <ParcelName parcel={parcel} />
                </span>
              </Container>
              <br />
              <Container text>
                <Grid.Column>
                  <PublicationForm
                    parcel={parcel}
                    publication={publication}
                    isTxIdle={isTxIdle}
                    onPublish={onPublish}
                    onCancel={onCancel}
                    isDisabled={!isLandAuthorized}
                  />
                  <TxStatus.Parcel parcel={parcel} />
                </Grid.Column>
              </Container>
              <br />
              {!isLandAuthorized ? (
                <Container text>
                  <Grid.Column>
                    <Message warning>
                      <h3>
                        <strong>Unauthorized</strong>
                      </h3>
                      You need to go to{' '}
                      <Link to={locations.settings}>Settings</Link> and
                      authorize the Marketplace to operate LAND on your behalf
                      before you can list it on sale.
                    </Message>
                  </Grid.Column>
                </Container>
              ) : null}
            </React.Fragment>
          )}
        </Parcel>
      </div>
    )
  }
}
