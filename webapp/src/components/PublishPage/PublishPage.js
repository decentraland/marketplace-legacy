import React from 'react'
import PropTypes from 'prop-types'

import { Container, Header, Grid } from 'semantic-ui-react'
import PublicationForm from './PublicationForm'
import Navbar from 'components/Navbar'

import { walletType } from 'components/types'

import './PublishPage.css'

export default class PublishPage extends React.PureComponent {
  static propTypes = {
    wallet: walletType,
    x: PropTypes.string.isRequired,
    y: PropTypes.string.isRequired
  }

  componentWillMount() {
    this.props.onConnect()
    // TODO: Check you own the parcel
  }

  render() {
    const { x, y } = this.props

    return (
      <div className="PublishPage">
        <Navbar />
        <Container text textAlign="center">
          <Header as="h2" size="huge" className="title">
            Publish LAND
          </Header>
          <p>
            Some explanation about the parcel {x}, {y} that you&#39;re about to
            publish.
          </p>
        </Container>

        <br />

        <Container text>
          <Grid>
            <Grid.Column>
              <PublicationForm />
            </Grid.Column>
          </Grid>
        </Container>
      </div>
    )
  }
}
