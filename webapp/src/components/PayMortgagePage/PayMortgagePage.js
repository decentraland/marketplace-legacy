import React from 'react'
import PropTypes from 'prop-types'
import { Container, Header } from 'semantic-ui-react'
import { t, T } from '@dapps/modules/translation/utils'

import Parcel from 'components/Parcel'
import { walletType, mortgageType } from 'components/types'
import ParcelModal from 'components/ParcelModal'
import ParcelDetailLink from 'components/ParcelDetailLink'
import TxStatus from 'components/TxStatus'
import ParcelName from 'components/ParcelName'
import SignInNotice from 'components/SignInNotice'
import {
  isMortgageOngoing,
  getMortgageOutstandingAmount
} from 'shared/mortgage'
import { formatMana } from 'lib/utils'
import PayMortgageForm from './PayMortgageForm'

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
    isTxIdle: PropTypes.bool.isRequired,
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
          <SignInNotice />
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
      onCancel,
      isTxIdle
    } = this.props

    if (!isConnecting && !isConnected) {
      return this.renderNotConnected()
    }

    return (
      <Parcel x={x} y={y} shouldDisallowOwner>
        {parcel => (
          <ParcelModal
            x={parcel.x}
            y={parcel.y}
            selected={parcel}
            isLoading={isLoading || isFetchingMortgages}
            title={t('mortgage.partial_payment')}
            subtitle={
              <T
                id="mortgage.partial_payment_desc"
                values={{
                  parcel_name: <ParcelDetailLink parcel={parcel} />,
                  outstanding_amount: formatMana(
                    getMortgageOutstandingAmount(mortgage)
                  )
                }}
              />
            }
            hasCustomFooter
          >
            <PayMortgageForm
              mana={wallet.mana}
              mortgage={mortgage}
              onSubmit={onSubmit}
              onCancel={onCancel}
              isTxIdle={isTxIdle}
              isDisabled={!isMortgageOngoing(mortgage)}
            />
            <TxStatus.Asset
              asset={parcel}
              name={
                <span>
                  {`${t('mortgage.pending_tx')} `}
                  <ParcelName parcel={parcel} />
                </span>
              }
            />
          </ParcelModal>
        )}
      </Parcel>
    )
  }
}
