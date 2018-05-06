import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Container, Message } from 'semantic-ui-react'
import Parcel from 'components/Parcel'
import ParcelModal from 'components/ParcelModal'
import TxStatus from 'components/TxStatus'
import { t, t_html } from 'modules/translation/utils'
import { isOnSale } from 'lib/parcelUtils'
import { buildCoordinate } from 'lib/utils'
import { locations } from 'locations'

import TransferParcelForm from './TransferParcelForm'

import './TransferParcelPage.css'

export default class TransferParcelPage extends React.PureComponent {
  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    isTxIdle: PropTypes.bool.isRequired,
    transferError: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onCleanTransfer: PropTypes.func.isRequired
  }

  render() {
    const { x, y, isTxIdle, transferError } = this.props
    const { onSubmit, onCancel, onCleanTransfer } = this.props

    return (
      <Parcel x={x} y={y} ownerOnly>
        {parcel => (
          <div className="TransferParcelPage">
            {isOnSale(parcel) ? (
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
