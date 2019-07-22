import React from 'react'
import PropTypes from 'prop-types'
import { t } from '@dapps/modules/translation/utils'

import { estateType } from 'components/types'
import TxStatus from 'components/TxStatus'
import EstateName from 'components/EstateName'
import EstateModal from 'components/EstateModal'
import { isNewEstate } from 'shared/estate'
import { ACTIONS } from 'shared/roles'
import EditEstateMetadataForm from '../EditEstateMetadataForm'

export default class EditEstateMetadata extends React.PureComponent {
  static propTypes = {
    estate: estateType.isRequired,
    isTxIdle: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  }

  render() {
    const { estate, isTxIdle, onSubmit, onCancel } = this.props

    return (
      <div className="EditEstate">
        <EstateModal
          estate={estate}
          parcels={estate.data.parcels}
          title={
            isNewEstate(estate)
              ? t('parcel_detail.actions.create_estate')
              : t('estate_edit.edit_estate')
          }
          subtitle={t('estate_edit.subtitle')}
          hasCustomFooter
        >
          <EditEstateMetadataForm
            estate={estate}
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
    )
  }
}
