import React from 'react'
import PropTypes from 'prop-types'
import { Container, Header, Grid } from 'semantic-ui-react'
import PublicationForm from './PublicationForm'
import Navbar from 'components/Navbar'
import ParcelName from 'components/ParcelName'
import Parcel from 'components/Parcel'

import { publicationType } from 'components/types'

import './PublishPage.css'

export default class PublishPage extends React.PureComponent {
  static propTypes = {
    publication: publicationType,
    onPublish: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  }

  render() {
    const { publication, x, y, onPublish, onCancel } = this.props

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
                  <ParcelName size="small" parcel={parcel} />
                </span>
              </Container>
              <br />
              <Container text>
                <Grid.Column>
                  <PublicationForm
                    parcel={parcel}
                    publication={publication}
                    onPublish={onPublish}
                    onCancel={onCancel}
                  />
                </Grid.Column>
              </Container>
            </React.Fragment>
          )}
        </Parcel>
      </div>
    )
  }
}
