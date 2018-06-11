import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Parcel from 'components/Parcel'
import ParcelModal from 'components/ParcelModal'
import TxStatus from 'components/TxStatus'
import { t, t_html } from 'modules/translation/utils'
import { buildCoordinate } from 'shared/parcel'
import { locations } from 'locations'

import ManageParcelForm from './ManageParcelForm'

import './ManageParcelPage.css'

export default class ManageParcelPage extends React.PureComponent {
  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    isTxIdle: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  }

  render() {
    const { x, y, isTxIdle } = this.props
    const { onSubmit, onCancel } = this.props

    return (
      <Parcel x={x} y={y} ownerOnly>
        {parcel => (
          <div className="ManageParcelPage">
            <ParcelModal
              x={x}
              y={y}
              title={t('parcel_manage.manage_land')}
              subtitle={t_html('parcel_manage.give_permission', {
                parcel_name: (
                  <Link to={locations.parcelDetail(x, y)}>
                    {buildCoordinate(x, y)}
                  </Link>
                )
              })}
              hasCustomFooter
            >
              <ManageParcelForm
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
