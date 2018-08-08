import React from 'react'
import PropTypes from 'prop-types'

import { t } from 'modules/translation/utils'
import EstateModal from './EstateModal'
import EditEstateMetadataForm from './EditEstateMetadataForm'
import { estateType } from 'components/types'

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
        </EstateModal>
      </div>
    )
  }
}
