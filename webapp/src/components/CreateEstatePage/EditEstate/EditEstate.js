import React from 'react'
import PropTypes from 'prop-types'
import { t } from 'modules/translation/utils'
import EstateModal from './EstateModal'
import EditEstateForm from './EditEstateForm'

import './EditEstate.css'

export default class EditEstate extends React.PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.object.isRequired
  }

  render() {
    const { onSubmit, onChange, onCancel, value: estate } = this.props
    console.log('esto es edit estate')
    console.log(estate)

    return (
      <div className="EditEstate">
        <EstateModal
          parcels={estate.parcels}
          title={t('estate_edit.edit_estate')}
          subtitle={t('estate_edit.subtitle')}
          hasCustomFooter
        >
          <EditEstateForm
            value={estate}
            onSubmit={onSubmit}
            onCancel={onCancel}
            onChange={onChange}
          />
        </EstateModal>
      </div>
    )
  }
}
