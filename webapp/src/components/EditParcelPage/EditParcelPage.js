import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Parcel from 'components/Parcel'
import ParcelModal from 'components/ParcelModal'
import TxStatus from 'components/TxStatus'
import EditParcelForm from './EditParcelForm'
import { t, t_html } from 'modules/translation/utils'
import { locations } from 'locations'

import './EditParcelPage.css'
import { buildCoordinate } from 'shared/parcel'

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
                parcel_name: (
                  <Link to={locations.parcelDetail(x, y)}>
                    {buildCoordinate(x, y)}
                  </Link>
                )
              })}
              hasCustomFooter
            >
              <EditParcelForm
                parcel={parcel}
                isTxIdle={isTxIdle}
                onSubmit={onSubmit}
                onCancel={onCancel}
              />
              <TxStatus.Parcel parcel={parcel} />
            </ParcelModal>
          </div>
        )}
      </Parcel>
    )
  }
}
