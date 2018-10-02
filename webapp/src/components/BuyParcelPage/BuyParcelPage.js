import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Loader, Container, Header } from 'semantic-ui-react'

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
import BuyWarningMessage from 'components/BuyAssetPage'

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
            {t('asset_buy.buy_asset')}
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
            {(isNotEnoughMana || isNotEnoughAllowance) && (
              <BuyWarningMessage publication={publication} wallet={wallet} />
            )}
            <ParcelModal
              x={x}
              y={y}
              title={t('asset_buy.buy_asset', { asset_type: t('name.parcel') })}
              subtitle={
                <T
                  id="asset_buy.about_to_buy"
                  values={{
                    name: <ParcelDetailLink parcel={parcel} />,
                    price: publication ? (
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
