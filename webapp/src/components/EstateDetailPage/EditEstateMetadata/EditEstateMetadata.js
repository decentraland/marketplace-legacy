import React from 'react'
import PropTypes from 'prop-types'

import { estateType } from 'components/types'
import TxStatus from 'components/TxStatus'
import EstateName from 'components/EstateName'
import { t } from '@dapps/modules/translation/utils'
import EditEstateMetadataForm from './EditEstateMetadataForm'
import EstateModal from './EstateModal'

export default class EditEstateMetadata extends React.PureComponent {
  static propTypes = {
    estate: estateType.isRequired,
    isCreation: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    isTxIdle: PropTypes.bool.isRequired
  }

  render() {
    const {
      onSubmit,
      onChange,
      onCancel,
      estate,
      isTxIdle,
      isCreation
    } = this.props

    return (
      <div className="EditEstate">
        <EstateModal
          estate={estate}
          parcels={estate.data.parcels}
          title={
            isCreation
              ? t('parcel_detail.actions.create_estate')
              : t('estate_edit.edit_estate')
          }
          subtitle={t('estate_edit.subtitle')}
          hasCustomFooter
        >
          <EditEstateMetadataForm
            estate={estate}
            onSubmit={onSubmit}
            onCancel={onCancel}
            onChange={onChange}
            isTxIdle={isTxIdle}
          />
          <TxStatus.Asset
            asset={estate}
            name={<EstateName estate={estate} />}
          />
        </EstateModal>
      </div>
    )
  }
}
