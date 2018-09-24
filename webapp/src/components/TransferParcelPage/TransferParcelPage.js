import React from 'react'
import PropTypes from 'prop-types'
import { Container, Message } from 'semantic-ui-react'
import Parcel from 'components/Parcel'
import ParcelModal from 'components/ParcelModal'
import ParcelDetailLink from 'components/ParcelDetailLink'
import TxStatus from 'components/TxStatus'
import { publicationType } from 'components/types'
import ParcelName from 'components/ParcelName'
import TransferAssetForm from 'components/TransferAssetForm'
import { t, T } from '@dapps/modules/translation/utils'
import { isOnSale } from 'shared/asset'

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
              subtitle={
                <T
                  id="transfer_parcel.about_to_transfer"
                  values={{ parcel_name: <ParcelDetailLink parcel={parcel} /> }}
                />
              }
              hasCustomFooter
            >
              <TransferAssetForm
                address={parcel.owner}
                asset={parcel}
                isTxIdle={isTxIdle}
                isOnSale={isOnSale(parcel, publications)}
                onSubmit={onSubmit}
                onCancel={onCancel}
              />
              <TxStatus.Asset
                asset={parcel}
                name={<ParcelName parcel={parcel} />}
              />
            </ParcelModal>
          </div>
        )}
      </Parcel>
    )
  }
}
