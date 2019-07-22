import React from 'react'
import PropTypes from 'prop-types'
import { t, T } from '@dapps/modules/translation/utils'

import Estate from 'components/Estate'
import EstateModal from 'components/EstateModal'
import TxStatus from 'components/TxStatus'
import TransferAssetForm from 'components/TransferAssetForm'
import EstateName from 'components/EstateName'

export default class TransferEstatePage extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    isTxIdle: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  }

  render() {
    const { id, isTxIdle, onSubmit, onCancel } = this.props

    return (
      <Estate id={id} shouldBeOwner>
        {estate => (
          <div className="TransferEstatePage">
            <EstateModal
              parcels={estate.data.parcels}
              title={t('transfer_estate.transfer_estate')}
              subtitle={
                <T
                  id="transfer_estate.about_to_transfer"
                  values={{ name: estate.data.name }}
                />
              }
              hasCustomFooter
            >
              <TransferAssetForm
                address={estate.owner}
                asset={estate}
                isTxIdle={isTxIdle}
                isOnSale={false}
                onSubmit={onSubmit}
                onCancel={onCancel}
              />
              <TxStatus.Asset
                asset={estate}
                name={<EstateName estate={estate} />}
              />
            </EstateModal>
          </div>
        )}
      </Estate>
    )
  }
}
