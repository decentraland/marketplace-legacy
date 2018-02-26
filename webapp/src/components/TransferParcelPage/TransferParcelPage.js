import React from 'react'
import PropTypes from 'prop-types'

import { Container, Header, Grid } from 'semantic-ui-react'
import Navbar from 'components/Navbar'
import Parcel from 'components/Parcel'
import ParcelName from 'components/ParcelName'

import TransferParcelForm from './TransferParcelForm'

import './TransferParcelPage.css'

export default class TransferParcelPage extends React.PureComponent {
  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    error: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onCleanTransfer: PropTypes.func.isRequired
  }

  render() {
    const { x, y, error } = this.props
    const { onSubmit, onCancel, onCleanTransfer } = this.props

    return (
      <div className="TransferParcelPage">
        <Navbar />
        <Parcel x={x} y={y} ownerOnly>
          {parcel => (
            <React.Fragment>
              <Container text textAlign="center">
                <Header as="h2" size="huge" className="title">
                  Transfer LAND
                </Header>
                <div className="subtitle">
                  You&#39;re about to transfer&nbsp;
                  <ParcelName size="small" parcel={parcel} />
                  <br />
                  Remember that transfering LAND is an irreversible operation.<br />
                  Please check the address carefully<br />
                </div>
              </Container>
              <br />
              <Container text>
                <Grid.Column>
                  <TransferParcelForm
                    parcel={parcel}
                    error={error}
                    onSubmit={onSubmit}
                    onCancel={onCancel}
                    onCleanTransfer={onCleanTransfer}
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
