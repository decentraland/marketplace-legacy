import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Container, Message } from 'semantic-ui-react'
import Parcel from 'components/Parcel'
import ParcelModal from 'components/ParcelModal'
import TxStatus from 'components/TxStatus'
import { t, t_html } from 'modules/translation/utils'
import { buildCoordinate, isOnSale } from 'shared/parcel'
import { locations } from 'locations'
import { publicationType } from 'components/types'

import TransferParcelForm from './TransferParcelForm'

import './TransferParcelPage.css'

export default class TransferParcelPage extends React.PureComponent {
  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    publications: PropTypes.objectOf(publicationType).isRequired,
    isTxIdle: PropTypes.bool.isRequired,
    transferError: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onCleanTransfer: PropTypes.func.isRequired
  }

  render() {
    const {
      x,
      y,
      isTxIdle,
      transferError,
      publications,
      onSubmit,
      onCancel,
      onCleanTransfer
    } = this.props

    return (
      <Parcel x={x} y={y} ownerOnly>
        {parcel => (
          <div className="TransferParcelPage">
            {isOnSale(parcel, publications) ? (
              <Container text>
                <Message
                  warning
                  icon="warning sign"
                  content={t('parcel_transfer.cant_transfer')}
                />
              </Container>
            ) : null}
            <ParcelModal
              x={x}
              y={y}
              title={t('parcel_transfer.transfer_land')}
              subtitle={t_html('parcel_transfer.about_to_transfer', {
                parcel_name: (
                  <Link to={locations.parcelDetail(x, y)}>
                    {buildCoordinate(x, y)}
                  </Link>
                )
              })}
              hasCustomFooter
            >
              <TransferParcelForm
                parcel={parcel}
                publications={publications}
                isTxIdle={isTxIdle}
                transferError={transferError}
                onSubmit={onSubmit}
                onCancel={onCancel}
                onCleanTransfer={onCleanTransfer}
              />
              <TxStatus.Parcel parcel={parcel} />
            </ParcelModal>
          </div>
        )}
      </Parcel>
    )
  }
}
