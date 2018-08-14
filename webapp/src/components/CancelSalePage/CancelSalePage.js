import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { locations } from 'locations'
import Parcel from 'components/Parcel'
import ParcelModal from 'components/ParcelModal'
import TxStatus from 'components/TxStatus'
import ParcelName from 'components/ParcelName'
import { buildCoordinate } from 'shared/parcel'
import { t, t_html } from 'modules/translation/utils'
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

  renderSubtitle = () => {
    const { x, y, publication } = this.props
    const parcel = (
      <Link to={locations.parcelDetail(x, y)}>{buildCoordinate(x, y)}</Link>
    )
    return publication
      ? t_html('parcel_cancel.about_to_cancel', { parcel })
      : t_html('parcel_cancel.not_for_sale', { parcel })
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
              subtitle={this.renderSubtitle()}
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
