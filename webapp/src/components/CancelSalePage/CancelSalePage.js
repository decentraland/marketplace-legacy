import React from 'react'
import PropTypes from 'prop-types'

import { Container, Header, Grid, Button } from 'semantic-ui-react'
import Navbar from 'components/Navbar'
import ParcelName from 'components/ParcelName'
import Parcel from 'components/Parcel'

import './CancelSalePage.css'

export default class CancelSalePage extends React.PureComponent {
  static propTypes = {
    x: PropTypes.isRequired,
    y: PropTypes.isRequired,
    isDisabled: PropTypes.bool.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  }

  handleConfirm = () => {
    const { publication, onConfirm } = this.props
    onConfirm(publication)
  }

  render() {
    const { x, y, publication, isDisabled, onCancel } = this.props

    return (
      <div className="CancelSalePage">
        <Navbar />
        <Parcel x={x} y={y} ownerOnly>
          {parcel => (
            <React.Fragment>
              <Container text textAlign="center">
                <Header as="h2" size="huge" className="title">
                  Cancel LAND Sale
                </Header>
                <span className="subtitle">
                  <ParcelName parcel={parcel} />{' '}
                  {publication ? (
                    <React.Fragment>
                      is currently on sale for{' '}
                      <strong className="price">
                        {(+publication.price).toLocaleString()} MANA
                      </strong>.
                    </React.Fragment>
                  ) : (
                    ''
                  )}
                </span>
                <span className="subtitle">
                  You are about to cancel this sale.
                </span>
              </Container>
              <br />
              <Container text>
                <Grid.Column className="text-center">
                  <Button onClick={onCancel} type="button">
                    Cancel
                  </Button>
                  <Button
                    onClick={this.handleConfirm}
                    type="button"
                    negative
                    disabled={isDisabled}
                  >
                    Confirm
                  </Button>
                </Grid.Column>
              </Container>
            </React.Fragment>
          )}
        </Parcel>
      </div>
    )
  }
}
