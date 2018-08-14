import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Container, Message } from 'semantic-ui-react'
import { locations } from 'locations'
import Parcel from 'components/Parcel'
import ParcelModal from 'components/ParcelModal'
import TxStatus from 'components/TxStatus'
import { publicationType } from 'components/types'
import ParcelName from 'components/ParcelName'
import { buildCoordinate } from 'shared/parcel'
import { isOnSale } from 'shared/asset'
import { t, t_html } from 'modules/translation/utils'
import TransferParcelForm from './TransferParcelForm'

import './TransferParcelPage.css'

export default class TransferParcelPage extends React.PureComponent {
  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    publications: PropTypes.objectOf(publicationType).isRequired,
    isTxIdle: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  }

  render() {
    const { x, y, isTxIdle, publications, onSubmit, onCancel } = this.props

    return (
      <Parcel x={x} y={y} ownerOnly>
        {parcel => (
          <div className="TransferParcelPage">
            {isOnSale(parcel, publications) ? (
              <Container text>
                <Message
                  warning
                  icon="warning sign"
                  content={t('transfer_parcel.cant_transfer')}
                />
              </Container>
            ) : null}
            <ParcelModal
              x={x}
              y={y}
              title={t('transfer_parcel.transfer_land')}
              subtitle={t_html('transfer_parcel.about_to_transfer', {
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
                isOnSale={isOnSale(parcel, publications)}
                onSubmit={onSubmit}
                onCancel={onCancel}
              />
              <TxStatus.Asset
                parcel={parcel}
                name={<ParcelName parcel={parcel} />}
              />
            </ParcelModal>
          </div>
        )}
      </Parcel>
    )
  }
}
