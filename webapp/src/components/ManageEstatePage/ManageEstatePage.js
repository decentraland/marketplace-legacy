import React from 'react'
import PropTypes from 'prop-types'
import { t, T } from '@dapps/modules/translation/utils'

import Estate from 'components/Estate'
import EstateModal from 'components/EditEstatePage/EditEstateMetadata/EstateModal'
import TxStatus from 'components/TxStatus'
import EstateName from 'components/EstateName'
import ManageAssetForm from 'components/ManageAssetForm'

export default class ManageEstatePage extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    isTxIdle: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  }

  render() {
    const { id, isTxIdle } = this.props
    const { onSubmit, onCancel } = this.props

    return (
      <Estate id={id} ownerOnly>
        {estate => (
          <div className="ManageParcelPage">
            <EstateModal
              parcels={estate.data.parcels}
              title={t('asset_manage.manage_asset', {
                asset_type: t('name.estate')
              })}
              subtitle={
                <T
                  id="asset_manage.give_permission"
                  values={{ asset_name: <EstateName estate={estate} /> }}
                />
              }
              hasCustomFooter
            >
              <ManageAssetForm
                asset={estate}
                isTxIdle={isTxIdle}
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
