import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Loader, Container, Header, Grid, Message } from 'semantic-ui-react'
import ParcelModal from 'components/ParcelModal'
import Parcel from 'components/Parcel'
import Mana from 'components/Mana'
import { walletType } from 'components/types'
import { locations } from 'locations'
import { formatMana, buildCoordinate } from 'lib/utils'
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
      <div>
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
      </div>
    )
  }

  renderMessage(isNotEnoughMana, isNotEnoughApproved) {
    if (!isNotEnoughMana && !isNotEnoughApproved) return null

    const { wallet, publication } = this.props
    const { balance, approvedBalance } = wallet

    return (
      <Container text>
        <Grid.Column>
          <Message
            warning
            icon="warning sign"
            header={
              isNotEnoughMana
                ? t('parcel_buy.total_balance', {
                    balance: formatMana(balance)
                  })
                : approvedBalance > 0
                  ? t('parcel_buy.approved_balance', {
                      approved_balance: formatMana(approvedBalance)
                    })
                  : t('parcel_buy.didnt_approve')
            }
            content={
              isNotEnoughMana ? (
                t('parcel_buy.needs_at_least', {
                  mana: formatMana(publication.price)
                })
              ) : approvedBalance > 0 ? (
                <React.Fragment>
                  <span>
                    {t('parcel_buy.needs_at_least', {
                      value: formatMana(publication.price)
                    })}
                  </span>
                  <br />
                  {t_html('parcel_buy.please_approve', {
                    settings_link: (
                      <Link to={locations.settings}>
                        {t('global.settings')}
                      </Link>
                    )
                  })}
                </React.Fragment>
              ) : (
                <React.Fragment>
                  {t_html('parcel_buy.please_approve', {
                    settings_link: (
                      <Link to={locations.settings}>
                        {t('global.settings')}
                      </Link>
                    )
                  })}
                </React.Fragment>
              )
            }
          />
        </Grid.Column>
      </Container>
    )
  }

  renderPage() {
    const { wallet, x, y, publication, isDisabled, onCancel } = this.props
    const { balance, approvedBalance } = wallet

    const price = publication ? parseFloat(publication.price, 10) : 0

    const isNotEnoughMana = balance < price
    const isNotEnoughApproved = approvedBalance < price

    return (
      <Parcel x={x} y={y}>
        {(parcel, isOwner) => (
          <div className="BuyParcelPage">
            {this.renderMessage(isNotEnoughMana, isNotEnoughApproved)}
            <ParcelModal
              x={x}
              y={y}
              title={t('parcel_buy.buy_land')}
              subtitle={t_html('parcel_buy.about_to_buy', {
                parcel_name: (
                  <Link to={locations.parcelDetail(x, y)}>
                    {buildCoordinate(x, y)}
                  </Link>
                ),
                parcel_price: publication ? (
                  <React.Fragment>
                    &nbsp;{t('global.for')}&nbsp;&nbsp;
                    <span
                      style={{
                        display: 'inline-block',
                        transform: 'translateY(3px)'
                      }}
                    >
                      <Mana amount={publication.price} size={14} />
                    </span>
                  </React.Fragment>
                ) : (
                  ''
                )
              })}
              onCancel={onCancel}
              onConfirm={this.handleConfirm}
              isDisabled={
                isDisabled || isOwner || isNotEnoughMana || isNotEnoughApproved
              }
            />
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
