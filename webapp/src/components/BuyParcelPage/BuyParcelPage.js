import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Loader, Container, Header, Grid, Message } from 'semantic-ui-react'

import { locations } from 'locations'
import ParcelModal from 'components/ParcelModal'
import ParcelDetailLink from 'components/ParcelDetailLink'
import Parcel from 'components/Parcel'
import Mana from 'components/Mana'
import {
  walletType,
  authorizationType,
  publicationType
} from 'components/types'
import { t, T } from '@dapps/modules/translation/utils'
import { isLegacyPublication } from 'modules/publication/utils'
import { formatMana } from 'lib/utils'

import './BuyParcelPage.css'

export default class BuyParcelPage extends React.PureComponent {
  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    wallet: walletType,
    authorization: authorizationType,
    publication: publicationType,
    isDisabled: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isConnected: PropTypes.bool.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  }

  static defaultProps = {
    publication: { price: 0 }
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
            <T
              id="global.sign_in_notice"
              values={{
                sign_in_link: (
                  <Link to={locations.signIn()}>{t('global.sign_in')}</Link>
                )
              }}
            />
          </p>
        </Container>
      </div>
    )
  }

  renderPage() {
    const {
      x,
      y,
      wallet,
      publication,
      isDisabled,
      isTxIdle,
      onCancel
    } = this.props
    const { balance } = wallet
    const allowance = this.getCurrentAllowance()

    const price = parseFloat(publication.price)

    const isNotEnoughMana = balance < price
    const isNotEnoughAllowance = allowance < price

    return (
      <Parcel x={x} y={y} ownerNotAllowed>
        {parcel => (
          <div className="BuyParcelPage">
            {isNotEnoughMana || isNotEnoughAllowance
              ? this.renderMessage()
              : null}
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
              isDisabled={isDisabled || isNotEnoughMana || isNotEnoughAllowance}
              isTxIdle={isTxIdle}
            />
          </div>
        )}
      </Parcel>
    )
  }

  renderMessage() {
    const { wallet, publication } = this.props
    const { balance } = wallet
    const allowance = this.getCurrentAllowance()

    const isNotEnoughMana = balance < parseFloat(publication.price)
    const isMarketplaceAllowed = allowance > 0

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
                : isMarketplaceAllowed
                  ? t('parcel_buy.allowed_balance', {
                      allowance: formatMana(allowance)
                    })
                  : this.isLegacyMarketplace()
                    ? t('parcel_buy.didnt_allow')
                    : t('parcel_buy.didnt_allow_new_marketplace')
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
                </React.Fragment>
              ) : (
                <React.Fragment>
                  {isMarketplaceAllowed ? (
                    <span>
                      {t('parcel_buy.needs_at_least', {
                        mana: formatMana(publication.price)
                      })}
                      <br />
                    </span>
                  ) : null}
                  <T
                    id={
                      this.isLegacyMarketplace()
                        ? 'parcel_buy.please_allow'
                        : 'parcel_buy.please_allow_new_marketplace'
                    }
                    values={{
                      settings_link: (
                        <Link to={locations.settings()}>
                          {t('global.settings')}
                        </Link>
                      )
                    }}
                  />
                </React.Fragment>
              )
            }
          />
        </Grid.Column>
      </Container>
    )
  }

  getCurrentAllowance() {
    const { allowances } = this.props.authorization

    return this.isLegacyMarketplace()
      ? allowances.LegacyMarketplace.MANAToken
      : allowances.Marketplace.MANAToken
  }

  isLegacyMarketplace() {
    return isLegacyPublication(this.props.publication)
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
