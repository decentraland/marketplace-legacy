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
import { t, t_html } from 'modules/translation/utils'

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
          {t('parcel_buy.buy_land')}
        </Header>
        <p className="sign-in">
          {t_html('global.sign_in_notice', {
            sign_in_link: (
              <Link to={locations.signIn}>{t('global.sign_in')}</Link>
            )
          })}
        </p>
      </Container>
    )
  }

  renderPage() {
    const { wallet, x, y, publication, isDisabled, onCancel } = this.props
    const { approvedBalance } = wallet
    const isNotEnough =
      publication && approvedBalance < parseFloat(publication.price, 10)

    return (
      <Parcel x={x} y={y}>
        {parcel => (
          <div className="BuyParcelPage">
            <Container text textAlign="center">
              <Header as="h2" size="huge" className="title">
                {t('parcel_buy.buy_land')}
              </Header>
              <span className="subtitle">
                {t_html('parcel_buy.about_to_buy', {
                  parcel_name: <ParcelName parcel={parcel} />
                })}&nbsp;
                {publication ? (
                  <React.Fragment>
                    {t('global.for')}&nbsp;
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
                  {t('global.cancel')}
                </Button>
                <Button
                  onClick={this.handleConfirm}
                  type="button"
                  primary
                  disabled={isDisabled || isNotEnough}
                >
                  {t('global.confirm')}
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
                            {t('parcel_buy.approved_balance', {
                              approved_balance: formatMana(approvedBalance)
                            })}
                          </strong>
                        </h3>
                        {t('parcel_buy.needs_at_least', {
                          value: formatMana(publication.price)
                        })}
                        <br />
                        {t_html('parcel_buy.plase_approve', {
                          settings_link: (
                            <Link to={locations.settings}>
                              {t('global.settings')}
                            </Link>
                          )
                        })}
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <h3>
                          <strong>{t('parcel_buy.didnt_approve')}</strong>
                        </h3>
                        {t('parcel_buy.should_approve')}
                        <br />
                        {t_html('parcel_buy.plase_approve', {
                          settings_link: (
                            <Link to={locations.settings}>
                              {t('global.settings')}
                            </Link>
                          )
                        })}
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
