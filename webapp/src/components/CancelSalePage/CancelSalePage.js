import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Parcel from 'components/Parcel'
import ParcelModal from 'components/ParcelModal'
import { buildCoordinate } from 'lib/utils'
import { t, t_html } from 'modules/translation/utils'
import { locations } from 'locations'

import './CancelSalePage.css'

export default class CancelSalePage extends React.PureComponent {
  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    isDisabled: PropTypes.bool.isRequired,
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
    const { x, y, publication, isDisabled, onCancel } = this.props

    return (
      <Parcel x={x} y={y} ownerOnly>
        {parcel => (
          <div className="CancelSalePage">
            <ParcelModal
              x={x}
              y={y}
              title={t('parcel_cancel.cancel_land')}
              subtitle={this.renderSubtitle()}
              onCancel={onCancel}
              onConfirm={this.handleConfirm}
              isDisabled={isDisabled || !publication}
            />
          </div>
        )}
      </Parcel>
    )
  }
}
