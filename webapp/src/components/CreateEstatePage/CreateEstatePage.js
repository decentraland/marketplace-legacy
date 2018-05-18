import React from 'react'
import PropTypes from 'prop-types'
import { Container } from 'semantic-ui-react'
import ParcelPreview from 'components/ParcelPreview'
import CreateEstate from './CreateEstate'
import Parcel from 'components/Parcel'
import { t } from 'modules/translation/utils'
import { isOwner } from 'modules/parcels/utils'

import './CreateEstatePage.css'

export default class CreateEstatePage extends React.PureComponent {
  static propTypes = {
    x: PropTypes.string.isRequired,
    y: PropTypes.string.isRequired,
    error: PropTypes.string,
    onCancel: PropTypes.func.isRequired,
    onEstateCreation: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    const x = parseInt(this.props.x, 10)
    const y = parseInt(this.props.y, 10)
    this.state = {
      parcels: [{ x, y }]
    }
  }

  handleParcelClick = wallet => (x, y) => {
    if (!isOwner(wallet, x, y)) {
      return
    }

    const { parcels } = this.state
    const isSelected = parcels.some(coords => coords.x === x && coords.y === y)

    if (isSelected) {
      const newParcels = parcels.filter(
        coords => !(coords.x === x && coords.y === y)
      )
      this.setState({ parcels: newParcels })
      return
    }

    this.setState({ parcels: [...parcels, { x, y }] })
    return
  }

  render() {
    const { x, y, error, onCancel, onEstateCreation } = this.props
    const { parcels } = this.state
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
              <CreateEstate
                onCancel={onCancel}
                onEstateCreation={onEstateCreation}
                parcels={parcels}
              />
            </Container>
          </div>
        )}
      </Parcel>
    )
  }
}
