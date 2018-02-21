import React from 'react'
import PropTypes from 'prop-types'
import { Container, Header, Grid } from 'semantic-ui-react'
import Navbar from 'components/Navbar'
import Parcel from 'components/Parcel'
import ParcelName from 'components/ParcelName'

import EditParcelForm from './EditParcelForm'
import './EditParcelPage.css'

export default class EditParcelPage extends React.PureComponent {
  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  }

  render() {
    const { x, y, onSubmit, onCancel } = this.props

    return (
      <div className="EditParcelPage">
        <Navbar />
        <Parcel x={x} y={y} ownerOnly>
          {parcel => (
            <React.Fragment>
              <Container text textAlign="center">
                <Header as="h2" size="huge" className="title">
                  Edit LAND
                </Header>
                <span className="subtitle">
                  Set a name and description for{' '}
                  <ParcelName size="small" parcel={parcel} />
                </span>
              </Container>
              <br />
              <Container text>
                <Grid>
                  <Grid.Column>
                    <EditParcelForm
                      parcel={parcel}
                      onSubmit={onSubmit}
                      onCancel={onCancel}
                    />
                  </Grid.Column>
                </Grid>
              </Container>
            </React.Fragment>
          )}
        </Parcel>
      </div>
    )
  }
}
