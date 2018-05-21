import React from 'react'
import PropTypes from 'prop-types'
import { Container } from 'semantic-ui-react'

import ParcelPreview from 'components/ParcelPreview'
import EstateSelectActions from './EstateSelectActions'
import Parcel from 'components/Parcel'
import { t } from 'modules/translation/utils'
import { isOwner } from 'modules/parcels/utils'
import { coordsType } from 'components/types';

import './EstateSelect.css'

export default class EstateSelect extends React.PureComponent {
  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    error: PropTypes.string,
    onCancel: PropTypes.func.isRequired,
    onContinue: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.arrayOf(coordsType).isRequired
  }

  handleParcelClick = wallet => (x, y) => {
    if (!isOwner(wallet, x, y)) {
      return
    }

    const { value: parcels, onChange } = this.props
    const isSelected = parcels.some(coords => coords.x === x && coords.y === y)

    if (isSelected) {
      const newParcels = parcels.filter(
        coords => !(coords.x === x && coords.y === y)
      )
      onChange(newParcels)
      return
    }

    onChange([...parcels, { x, y }])
    return
  }

  render() {
    const { x, y, error, onCancel, onContinue, value: parcels } = this.props
    if (error) {
      return null
    }
    return (
      <Parcel x={x} y={y}>
        {(parcel, isOwner, wallet) => (
          <div className="CreateDetailPage">
            <div className="parcel-preview" title={t('parcel_detail.view')}>
              <ParcelPreview
                x={parcel.x}
                y={parcel.y}
                selected={parcels}
                isDraggable
                showMinimap
                showPopup
                showControls
                onClick={this.handleParcelClick(wallet)}
              />
            </div>
            <Container>
              <EstateSelectActions
                onCancel={onCancel}
                onContinue={onContinue}
                disabled={parcels.length <= 1}
              />
            </Container>
          </div>
        )}
      </Parcel>
    )
  }
}
