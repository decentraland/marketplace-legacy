import React from 'react'
import PropTypes from 'prop-types'

import Estate from 'components/Estate'
import EstateModal from 'components/EstateDetailPage/EditEstateMetadata/EstateModal'
import TxStatus from 'components/TxStatus'
import { t, t_html } from 'modules/translation/utils'
import TransferAssetForm from 'components/TransferAssetForm'

export default class TransferEstatePage extends React.PureComponent {
  static propTypes = {
    assetId: PropTypes.string.isRequired,
    isTxIdle: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  }

  render() {
    const { assetId, isTxIdle, onSubmit, onCancel } = this.props

    return (
      <Estate assetId={assetId} ownerOnly>
        {estate => (
          <div className="TransferEstatePage">
            <EstateModal
              parcels={estate.data.parcels}
              title={t('transfer_estate.transfer_estate')}
              subtitle={t_html('transfer_estate.about_to_transfer', {
                name: estate.data.name
              })}
              hasCustomFooter
            >
              <TransferAssetForm
                asset={estate}
                isTxIdle={isTxIdle}
                isOnSale={false}
                onSubmit={onSubmit}
                onCancel={onCancel}
              />
              <TxStatus.Asset
                asset={estate}
                name={<span>{t('estate_detail.pending_tx')}</span>}
              />
            </EstateModal>
          </div>
        )}
      </Estate>
    )
  }
}
