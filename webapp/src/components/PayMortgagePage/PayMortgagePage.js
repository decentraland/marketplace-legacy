import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Container, Header } from 'semantic-ui-react'

import Parcel from 'components/Parcel'
import { walletType, mortgageType } from 'components/types'
import { t, t_html } from 'modules/translation/utils'
import { locations } from 'locations'
import { buildCoordinate, formatMana } from 'lib/utils'
import PayMortgageForm from './PayMortgageForm'
import ParcelModal from 'components/ParcelModal'
import { isMortgageOngoing } from 'modules/mortgage/utils'

import './PayMortgagePage.css'

export default class PayMortgagePage extends React.PureComponent {
  static propTypes = {
    wallet: walletType,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isConnecting: PropTypes.bool.isRequired,
    isConnected: PropTypes.bool.isRequired,
    isFetchingMortgages: PropTypes.bool.isRequired,
    mortgage: mortgageType,
    onFetchMortgage: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  }

  componentDidMount() {
    this.isAdditionalResourcesFetched = false
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isLoading && !this.isAdditionalResourcesFetched) {
      this.props.onFetchMortgage()
      this.isAdditionalResourcesFetched = true
    }
  }

  renderNotConnected() {
    return (
      <div>
        <Container text textAlign="center" className="BuyParcelPage">
          <Header as="h2" size="huge" className="title">
            {t('mortgage.partial_payment')}
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

  render() {
    const {
      x,
      y,
      mortgage,
      isLoading,
      isConnecting,
      isConnected,
      isFetchingMortgages,
      wallet,
      onSubmit,
      onCancel
    } = this.props

    if (!isConnecting && !isConnected) {
      return this.renderNotConnected()
    }

    return (
      <Parcel x={x} y={y} ownerNotAllowed>
        {parcel => (
          <React.Fragment>
            <ParcelModal
              x={parcel.x}
              y={parcel.y}
              selected={parcel}
              isLoading={isLoading || isFetchingMortgages}
              title={t('mortgage.partial_payment')}
              subtitle={t_html('mortgage.partial_payment_desc', {
                parcel_name: (
                  <Link to={locations.parcelDetail(x, y)}>
                    {buildCoordinate(x, y)}
                  </Link>
                ),
                outstanding_amount: formatMana(
                  mortgage ? mortgage.outstanding_amount : 0
                )
              })}
              hasCustomFooter
            >
              <PayMortgageForm
                balance={wallet.balance}
                mortgage={mortgage}
                onSubmit={onSubmit}
                onCancel={onCancel}
                isDisabled={!isMortgageOngoing(mortgage)}
              />
            </ParcelModal>
          </React.Fragment>
        )}
      </Parcel>
    )
  }
}
