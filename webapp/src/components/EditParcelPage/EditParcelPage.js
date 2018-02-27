import React from 'react'
import PropTypes from 'prop-types'

import { Container, Header, Grid } from 'semantic-ui-react'
import Navbar from 'components/Navbar'
import Parcel from 'components/Parcel'
import ParcelName from 'components/ParcelName'
import TxStatus from 'components/TxStatus'

import EditParcelForm from './EditParcelForm'
import './EditParcelPage.css'

export default class EditParcelPage extends React.PureComponent {
  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    isTxIdle: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  }

  render() {
    const { x, y, isTxIdle, onSubmit, onCancel } = this.props

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
                  Set a name and description for <ParcelName parcel={parcel} />
                </span>
              </Container>
              <br />
              <Container text>
                <Grid.Column>
                  <EditParcelForm
                    parcel={parcel}
                    isTxIdle={isTxIdle}
                    onSubmit={onSubmit}
                    onCancel={onCancel}
                  />
                  <TxStatus.Parcel parcel={parcel} />
                </Grid.Column>
              </Container>
            </React.Fragment>
          )}
        </Parcel>
      </div>
    )
  }
}
