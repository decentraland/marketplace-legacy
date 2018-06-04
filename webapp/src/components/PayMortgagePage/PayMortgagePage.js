import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Loader, Container, Header } from 'semantic-ui-react'

import Parcel from 'components/Parcel'
import { walletType } from 'components/types'
import { t, t_html } from 'modules/translation/utils'
import { locations } from 'locations'
import { buildCoordinate, formatMana } from 'lib/utils'
import PayMortgageForm from './PayMortgageForm'
import ParcelModal from 'components/ParcelModal'
import { isMortgageOngoing } from 'modules/mortgage/utils'

export default class PayMortgagePage extends React.PureComponent {
  static propTypes = {
    wallet: walletType,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isConnected: PropTypes.bool.isRequired,
    mortgage: PropTypes.object, //TODO mortgageType
    onFetchMortgage: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
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
      wallet,
      onSubmit,
      onCancel
    } = this.props

    return (
      <Parcel x={x} y={y} ownerNotAllowed>
        {parcel =>
          isMortgageOngoing(mortgage) ? (
            <React.Fragment>
              <ParcelModal
                x={x}
                y={y}
                isLoading={isLoading}
                title={t('mortgage.partial_payment')}
                subtitle={t_html('mortgage.partial_payment_desc', {
                  parcel_name: (
                    <Link to={locations.parcelDetail(x, y)}>
                      {buildCoordinate(x, y)}
                    </Link>
                  ),
                  outstanding_amount: formatMana(mortgage.outstanding_amount)
                })}
                hasCustomFooter
              >
                <PayMortgageForm
                  balance={wallet.balance}
                  mortgage={mortgage}
                  isTxIdle={false}
                  onSubmit={onSubmit}
                  onCancel={onCancel}
                />
              </ParcelModal>
            </React.Fragment>
          ) : null
        }
      </Parcel>
    )
  }
}
