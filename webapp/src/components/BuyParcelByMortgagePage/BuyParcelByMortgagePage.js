import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Loader, Container, Header, Message } from 'semantic-ui-react'

import { locations } from 'locations'
import Parcel from 'components/Parcel'
import ParcelModal from 'components/ParcelModal'
import ParcelDetailLink from 'components/ParcelDetailLink'
import TxStatus from 'components/TxStatus'
import ParcelName from 'components/ParcelName'
import { authorizationType, publicationType } from 'components/types'
import { t, T } from '@dapps/modules/translation/utils'
import { isOpen } from 'shared/publication'
import { formatMana } from 'lib/utils'
import MortgageForm from './MortgageForm'

export default class BuyParcelByMortgagePage extends React.PureComponent {
  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    balance: PropTypes.number.isRequired,
    authorization: authorizationType,
    publication: publicationType,
    error: PropTypes.string,
    isTxIdle: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isConnected: PropTypes.bool.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
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
            {t('mortgage.request')}
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

  render() {
    const {
      x,
      y,
      balance,
      authorization,
      publication,
      isTxIdle,
      isLoading,
      isConnected,
      onConfirm,
      onCancel,
      error
    } = this.props

    if (isLoading) {
      return this.renderLoading()
    }

    if (!isConnected) {
      return this.renderNotConnected()
    }

    const { allowances } = authorization
    const isMortgageApprovedForMana = allowances.MortgageHelper.MANAToken > 0
    const isMortgageApprovedForRCN = allowances.MortgageManager.RCNToken > 0

    return (
      <Parcel x={x} y={y} ownerNotAllowed>
        {parcel =>
          isOpen(publication) ? (
            <div className="BuyParcelByMortgage">
              {!isMortgageApprovedForMana ? (
                <Container text>
                  <Message
                    warning
                    icon="warning sign"
                    header={t('global.disallowed')}
                    content={
                      <T
                        id="mortgage.please_authorize_MANA"
                        values={{
                          settings_link: (
                            <Link to={locations.settings()}>Settings</Link>
                          )
                        }}
                      />
                    }
                  />
                </Container>
              ) : null}
              {!isMortgageApprovedForRCN ? (
                <Container text>
                  <Message
                    warning
                    icon="warning sign"
                    header={t('global.disallowed')}
                    content={
                      <T
                        id="mortgage.please_authorize_RCN"
                        values={{
                          settings_link: (
                            <Link to={locations.settings()}>Settings</Link>
                          )
                        }}
                      />
                    }
                  />
                </Container>
              ) : null}
              <ParcelModal
                x={x}
                y={y}
                price={publication.price}
                isLoading={isLoading}
                title={t('mortgage.request')}
                subtitle={
                  <T
                    id="mortgage.request_land"
                    values={{
                      parcel_name: <ParcelDetailLink parcel={parcel} />,
                      parcel_price: formatMana(publication.price)
                    }}
                  />
                }
                hasCustomFooter
              >
                <MortgageForm
                  balance={balance}
                  parcel={parcel}
                  publication={publication}
                  onPublish={onConfirm}
                  onCancel={onCancel}
                  error={error}
                  isTxIdle={isTxIdle}
                  isDisabled={
                    !isMortgageApprovedForMana || !isMortgageApprovedForRCN
                  }
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
            </div>
          ) : null
        }
      </Parcel>
    )
  }
}
