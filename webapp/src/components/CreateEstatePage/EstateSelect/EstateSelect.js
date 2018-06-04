import React from 'react'
import PropTypes from 'prop-types'
import { Container } from 'semantic-ui-react'

import ParcelPreview from 'components/ParcelPreview'
import EstateSelectActions from './EstateSelectActions'
import Parcel from 'components/Parcel'
import { t } from 'modules/translation/utils'
import { isOwner } from 'modules/parcels/utils'
import { coordsType } from 'components/types'
import { match, isEqual } from 'lib/utils'

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

  // TODO move all this functions to an estate util file
  isNeighbour = (x, y) => coords => {
    return (
      (coords.x === x && (coords.y + 1 === y || coords.y - 1 === y)) ||
      (coords.y === y && (coords.x + 1 === x || coords.x - 1 === x))
    )
  }

  hasNeighbour = (x, y) => {
    const { value: parcels } = this.props
    return parcels.some(this.isNeighbour(x, y))
  }

  getNeighbours = (x, y, parcels = this.props.parcels) => {
    return parcels.filter(this.isNeighbour(x, y))
  }

  areConnected = (parcels, alreadyTraveled = [], remaining = [...parcels]) => {
    if (alreadyTraveled.length === parcels.length) {
      return true
    }

    if (remaining.length === 0) {
      return false
    }

    let actual = remaining.pop()

    const neighbours = this.getNeighbours(actual.x, actual.y, parcels).filter(
      coords => {
        return (
          parcels.some(match(coords)) && !alreadyTraveled.some(match(coords))
        )
      }
    )

    return this.areConnected(
      parcels,
      [...alreadyTraveled, ...neighbours],
      remaining
    )
  }

  handleParcelClick = wallet => (x, y) => {
    if (!isOwner(wallet, x, y)) {
      return
    }

    if (!this.hasNeighbour(x, y)) {
      return
    }

    const { value: parcels, onChange } = this.props
    const isSelected = parcels.some(match({ x, y }))

    if (isSelected) {
      const newParcels = parcels.filter(coords => !isEqual(coords, { x, y }))

      if (!this.areConnected(newParcels) && newParcels.length > 1) {
        return
      }

      return onChange(newParcels)
    }

    onChange([...parcels, { x, y }])
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
