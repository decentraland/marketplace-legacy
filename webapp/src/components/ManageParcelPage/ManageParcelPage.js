import React from 'react'
import PropTypes from 'prop-types'
import Parcel from 'components/Parcel'
import ParcelModal from 'components/ParcelModal'
import TxStatus from 'components/TxStatus'
import ParcelName from 'components/ParcelName'
import ParcelDetailLink from 'components/ParcelDetailLink'
import { t, T } from '@dapps/modules/translation/utils'
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
              subtitle={
                <T
                  id="parcel_manage.give_permission"
                  values={{ parcel_name: <ParcelDetailLink parcel={parcel} /> }}
                />
              }
              hasCustomFooter
            >
              <ManageParcelForm
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
