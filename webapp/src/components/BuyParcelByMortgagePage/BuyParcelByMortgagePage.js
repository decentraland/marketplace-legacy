import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Loader, Container, Header } from 'semantic-ui-react'

import Parcel from 'components/Parcel'
import { walletType, publicationType } from 'components/types'
import { t, t_html } from 'modules/translation/utils'
import { locations } from 'locations'
import { isOpen } from 'shared/publication'
import { buildCoordinate } from 'shared/parcel'
import { formatMana } from 'lib/utils'
import MortgageForm from './MortgageForm'
import ParcelModal from 'components/ParcelModal'
import TxStatus from 'components/TxStatus'
import ParcelName from 'components/ParcelName'

export default class BuyParcelByMortgagePage extends React.PureComponent {
  static propTypes = {
    wallet: walletType,
    publication: publicationType,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
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

    return (
      <Parcel x={x} y={y} ownerNotAllowed>
        {parcel =>
          isOpen(publication) ? (
            <React.Fragment>
              <ParcelModal
                x={x}
                y={y}
                price={publication.price}
                isLoading={isLoading}
                title={t('mortgage.request')}
                subtitle={t_html('mortgage.request_land', {
                  parcel_name: (
                    <Link to={locations.parcelDetail(x, y)}>
                      {buildCoordinate(x, y)}
                    </Link>
                  ),
                  parcel_price: formatMana(publication.price)
                })}
                hasCustomFooter
              >
                <MortgageForm
                  parcel={parcel}
                  publication={publication}
                  onPublish={onConfirm}
                  onCancel={onCancel}
                  error={error}
                  isTxIdle={isTxIdle}
                />
                <TxStatus.Asset
                  parcel={parcel}
                  name={
                    <span>
                      {`${t('mortgage.pending_tx')} `}
                      <ParcelName parcel={parcel} />
                    </span>
                  }
                />
              </ParcelModal>
            </React.Fragment>
          ) : null
        }
      </Parcel>
    )
  }
}
