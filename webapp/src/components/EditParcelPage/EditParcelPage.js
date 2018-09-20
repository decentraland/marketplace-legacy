import React from 'react'
import PropTypes from 'prop-types'
import Parcel from 'components/Parcel'
import ParcelModal from 'components/ParcelModal'
import TxStatus from 'components/TxStatus'
import ParcelName from 'components/ParcelName'
import ParcelDetailLink from 'components/ParcelDetailLink'
import { t, t_html } from '@dapps/modules/translation/utils'
import EditParcelForm from './EditParcelForm'

import './EditParcelPage.css'

export default class EditParcelPage extends React.PureComponent {
  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    isTxIdle: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  }

  render() {
    const { x, y, isTxIdle, onSubmit, onCancel } = this.props

    return (
      <Parcel x={x} y={y} ownerOnly>
        {parcel => (
          <div className="EditParcelPage">
            <ParcelModal
              x={x}
              y={y}
              title={t('parcel_edit.edit_land')}
              subtitle={t_html('parcel_edit.set_name_and_desc', {
                parcel_name: <ParcelDetailLink parcel={parcel} />
              })}
              hasCustomFooter
            >
              <EditParcelForm
                parcel={parcel}
                isTxIdle={isTxIdle}
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
