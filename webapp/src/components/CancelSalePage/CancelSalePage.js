import React from 'react'
import PropTypes from 'prop-types'

import Parcel from 'components/Parcel'
import ParcelModal from 'components/ParcelModal'
import ParcelDetailLink from 'components/ParcelDetailLink'
import TxStatus from 'components/TxStatus'
import ParcelName from 'components/ParcelName'
import { t, T } from '@dapps/modules/translation/utils'
import CancelSaleForm from './CancelSaleForm'

export default class CancelSalePage extends React.PureComponent {
  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    isTxIdle: PropTypes.bool.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  }

  handleConfirm = () => {
    const { publication, onConfirm } = this.props
    onConfirm(publication)
  }

  renderSubtitle = parcel => {
    const { publication } = this.props
    const parceDetailLink = <ParcelDetailLink parcel={parcel} />

    return publication ? (
      <T
        id="parcel_cancel.about_to_cancel"
        values={{ parcel: parceDetailLink }}
      />
    ) : (
      <T id="parcel_cancel.not_for_sale" values={{ parcel: parceDetailLink }} />
    )
  }

  render() {
    const { x, y, publication, isTxIdle, onCancel } = this.props

    return (
      <Parcel x={x} y={y} ownerOnly>
        {parcel => (
          <div className="CancelSalePage">
            <ParcelModal
              x={x}
              y={y}
              title={t('parcel_cancel.cancel_land')}
              subtitle={this.renderSubtitle(parcel)}
              hasCustomFooter
            >
              <CancelSaleForm
                onCancel={onCancel}
                onConfirm={this.handleConfirm}
                isTxIdle={isTxIdle}
                isDisabled={!publication}
              />
              <TxStatus.Asset
                parcel={parcel}
                name={<ParcelName parcel={parcel} />}
              />
            </ParcelModal>
          </div>
        )}
      </Parcel>
    )
  }
}
