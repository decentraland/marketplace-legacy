import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import {
  Loader,
  Container,
  Header,
  Grid,
  Button,
  Message
} from 'semantic-ui-react'
import ParcelName from 'components/ParcelName'
import Parcel from 'components/Parcel'
import { walletType } from 'components/types'
import { locations } from 'locations'
import { formatMana } from 'lib/utils'

import './BuyParcelPage.css'

export default class BuyParcelPage extends React.PureComponent {
  static propTypes = {
    wallet: walletType,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    isDisabled: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isConnected: PropTypes.bool.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  }

  handleConfirm = () => {
    const { publication, onConfirm } = this.props
    onConfirm(publication)
  }

  renderLoading() {
    return (
      <div>
        <Loader active size="massive" />
      </div>
    )
  }

  renderNotConnected() {
    return (
      <Container text textAlign="center" className="BuyParcelPage">
        <Header as="h2" size="huge" className="title">
          Buy LAND
        </Header>
        <p className="sign-in">
          You need to <Link to={locations.signIn}>Sign In</Link> to access this
          page
        </p>
      </Container>
    )
  }

  renderPage() {
    const { wallet, x, y, publication, isDisabled, onCancel } = this.props
    const { approvedBalance } = wallet
    const isNotEnough = publication && approvedBalance < parseFloat(publication.price, 10)

    return (
      <Parcel x={x} y={y}>
        {parcel => (
          <div className="BuyParcelPage">
            <Container text textAlign="center">
              <Header as="h2" size="huge" className="title">
                Buy LAND
              </Header>
              <span className="subtitle">
                You are about to buy&nbsp;
                <ParcelName parcel={parcel} />{' '}
                {publication ? (
                  <React.Fragment>
                    for{' '}
                    <strong className="price">
                      {formatMana(publication.price)}
                    </strong>
                  </React.Fragment>
                ) : (
                  ''
                )}
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
                  primary
                  disabled={isDisabled || isNotEnough}
                >
                  Confirm
                </Button>
              </Grid.Column>
            </Container>
            <br />
            {isNotEnough ? (
              <Container text>
                <Grid.Column>
                  <Message warning>
                    {approvedBalance > 0 ? (
                      <React.Fragment>
                        <h3>
                          <strong>
                            Your approved balance is{' '}
                            {formatMana(approvedBalance)}
                          </strong>
                        </h3>
                        You need at least{' '}
                        <strong className="price">
                          {formatMana(publication.price)}
                        </strong>{' '}
                        in order to buy this LAND.
                        <br />
                        Please go to{' '}
                        <Link to={locations.settings}>Settings</Link> and
                        approve some more MANA.
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <h3>
                          <strong>You haven&apos;t approved MANA</strong>
                        </h3>
                        You need to approve MANA to be used by the Marketplace
                        before you can buy LAND.
                        <br />
                        Please go to{' '}
                        <Link to={locations.settings}>Settings</Link> and
                        approve some MANA.
                      </React.Fragment>
                    )}
                  </Message>
                </Grid.Column>
              </Container>
            ) : null}
          </div>
        )}
      </Parcel>
    )
  }

  render() {
    const { isConnected, isLoading } = this.props

    if (isLoading) {
      return this.renderLoading()
    }

    if (!isConnected) {
      return this.renderNotConnected()
    }

    return this.renderPage()
  }
}
