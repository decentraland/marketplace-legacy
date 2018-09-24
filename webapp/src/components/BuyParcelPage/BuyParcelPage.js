import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Loader, Container, Header, Grid, Message } from 'semantic-ui-react'

import { locations } from 'locations'
import ParcelModal from 'components/ParcelModal'
import ParcelDetailLink from 'components/ParcelDetailLink'
import Parcel from 'components/Parcel'
import Mana from 'components/Mana'
import { walletType } from 'components/types'
import { t, T } from '@dapps/modules/translation/utils'
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
      <div>
        <Container text textAlign="center" className="BuyParcelPage">
          <Header as="h2" size="huge" className="title">
            {t('parcel_buy.buy_land')}
          </Header>
          <p className="sign-in">
            {
              <T
                id="global.sign_in_notice"
                values={{
                  sign_in_link: (
                    <Link to={locations.signIn()}>{t('global.sign_in')}</Link>
                  )
                }}
              />
            }
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
                <React.Fragment>
                  <span>
                    {t('parcel_buy.needs_at_least', {
                      mana: formatMana(publication.price)
                    })}
                  </span>
                  <br />
                  {
                    <T
                      id="parcel_buy.buy_mana"
                      values={{
                        click_here: (
                          <Link to={locations.buyMana()}>
                            {t('global.click_here')}
                          </Link>
                        )
                      }}
                    />
                  }
                </React.Fragment>
              ) : approvedBalance > 0 ? (
                <React.Fragment>
                  <span>
                    {t('parcel_buy.needs_at_least', {
                      mana: formatMana(publication.price)
                    })}
                  </span>
                  <br />
                  {
                    <T
                      id="parcel_buy.please_approve"
                      values={{
                        settings_link: (
                          <Link to={locations.settings()}>
                            {t('global.settings')}
                          </Link>
                        )
                      }}
                    />
                  }
                </React.Fragment>
              ) : (
                <React.Fragment>
                  {
                    <T
                      id="parcel_buy.please_approve"
                      values={{
                        settings_link: (
                          <Link to={locations.settings()}>
                            {t('global.settings')}
                          </Link>
                        )
                      }}
                    />
                  }
                </React.Fragment>
              )
            }
          />
        </Grid.Column>
      </Container>
    )
  }

  renderPage() {
    const {
      wallet,
      x,
      y,
      publication,
      isDisabled,
      isTxIdle,
      onCancel
    } = this.props
    const { balance, approvedBalance } = wallet

    const price = publication ? parseFloat(publication.price) : 0

    const isNotEnoughMana = balance < price
    const isNotEnoughApproved = approvedBalance < price

    return (
      <Parcel x={x} y={y} ownerNotAllowed>
        {parcel => (
          <div className="BuyParcelPage">
            {this.renderMessage(isNotEnoughMana, isNotEnoughApproved)}
            <ParcelModal
              x={x}
              y={y}
              title={t('parcel_buy.buy_land')}
              subtitle={
                <T
                  id="parcel_buy.about_to_buy"
                  values={{
                    parcel_name: <ParcelDetailLink parcel={parcel} />,
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
                  }}
                />
              }
              onCancel={onCancel}
              onConfirm={this.handleConfirm}
              isDisabled={isDisabled || isNotEnoughMana || isNotEnoughApproved}
              isTxIdle={isTxIdle}
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
