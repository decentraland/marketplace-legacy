import React from 'react'
import PropTypes from 'prop-types'

import Parcel from 'components/Parcel'
import ParcelModal from 'components/ParcelModal'
import ParcelDetailLink from 'components/ParcelDetailLink'
import TxStatus from 'components/TxStatus'
import ParcelName from 'components/ParcelName'
import { t, T } from '@dapps/modules/translation/utils'
import CancelSaleAssetForm from 'components/CancelSaleAssetForm'
import { publicationType } from 'components/types'

export default class CancelSaleParcelPage extends React.PureComponent {
  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    publication: publicationType,
    isTxIdle: PropTypes.bool.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  }

  handleConfirm = () => {
    const { publication, onConfirm } = this.props
    onConfirm(publication)
  }

  renderSubtitle = parcel => {
    const { publication } = this.props
    const parcelDetailLink = <ParcelDetailLink parcel={parcel} />

    return publication ? (
      <T
        id="asset_cancel.about_to_cancel"
        values={{ name: parcelDetailLink }}
      />
    ) : (
      <T
        id="asset_cancel.not_for_sale"
        values={{ asset_name: t('name.parcel'), asset: parcelDetailLink }}
      />
    )
  }

  render() {
    const { x, y, publication, isTxIdle, onCancel } = this.props

    return (
      <Parcel x={x} y={y} ownerOnly>
        {parcel => (
          <div className="CancelSalePage">
            <ParcelModal
              x={x}
              y={y}
              title={t('asset_cancel.cancel_sale')}
              subtitle={this.renderSubtitle(parcel)}
              hasCustomFooter
            >
              <CancelSaleAssetForm
                onCancel={onCancel}
                onConfirm={this.handleConfirm}
                isTxIdle={isTxIdle}
                isDisabled={!publication}
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
