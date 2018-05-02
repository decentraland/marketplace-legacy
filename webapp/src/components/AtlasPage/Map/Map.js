import React from 'react'
import PropTypes from 'prop-types'
import { isMobile } from 'lib/utils'

import { locations } from 'locations'
import { Loader } from 'semantic-ui-react'
import { walletType, parcelType, districtType } from 'components/types'
import * as parcelUtils from 'lib/parcelUtils'

import ParcelsMap from './ParcelsMap'

import './Map.css'

export default class MapComponent extends React.Component {
  static propTypes = {
    isReady: PropTypes.bool,
    wallet: walletType.isRequired,
    parcels: PropTypes.objectOf(parcelType).isRequired,
    districts: PropTypes.objectOf(districtType).isRequired,
    center: PropTypes.shape({
      x: PropTypes.string,
      y: PropTypes.string
    }),
    marker: PropTypes.string,
    onNavigate: PropTypes.func.isRequired,
    onLoading: PropTypes.func.isRequired,
    onRangeChange: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired
  }

  static defaultProps = {
    center: {
      x: '0',
      y: '0'
    }
  }

  constructor(props) {
    super(props)

    const { minX, minY, maxX, maxY } = parcelUtils.getBounds()
    this.bounds = [[minX, minY], [maxX, maxY]]

    this.baseZoom = 10
    this.baseTileSize = isMobile() ? 64 : 128

    this.state = {
      zoom: this.baseZoom - 3
    }
  }

  getCenter() {
    const { x, y } = this.props.center
    return {
      x: parseInt(x, 10) || 0,
      y: parseInt(y, 10) || 0
    }
  }

  handleMoveStart = () => {
    const { onLoading } = this.props
    onLoading()
  }

  handleMoveEnd = ({ position, bounds }) => {
    const { marker, onNavigate } = this.props
    const offset = this.getBoundsOffset()

    this.fetchParcelRange(
      position.x,
      position.y,
      bounds.min.x + offset,
      bounds.min.y + offset,
      bounds.max.x - offset,
      bounds.max.y - offset
    )

    onNavigate(locations.parcelMapDetail(position.x, position.y, marker))
  }

  handleZoomEnd = zoom => {
    this.setState({ zoom })
  }

  fetchParcelRange(centerX, centerY, minX, minY, maxX, maxY) {
    const bounds = parcelUtils.getBounds()
    const { onRangeChange } = this.props
    const nw = {
      x: bounds.minX > minX ? bounds.minX : minX,
      y: bounds.minY > minY ? bounds.minY : minY
    }
    const se = {
      x: bounds.maxX < maxX ? bounds.maxX : maxX,
      y: bounds.maxY < maxY ? bounds.maxY : maxY
    }
    const center = { x: centerX, y: centerY }
    onRangeChange(center, nw, se)
  }

  getTileSize() {
    const zoomDifference = this.baseZoom - this.state.zoom
    return this.baseTileSize / Math.pow(2, zoomDifference)
  }

  getBoundsOffset() {
    return -(this.baseZoom - this.state.zoom)
  }

  render() {
    const { zoom } = this.state
    const { wallet, parcels, districts, isReady, onSelect, marker } = this.props
    const { x, y } = this.getCenter()

    return isReady ? (
      <div className="map-container">
        <ParcelsMap
          x={x}
          y={y}
          wallet={wallet}
          parcels={parcels}
          districts={districts}
          minZoom={this.baseZoom - 4}
          maxZoom={this.baseZoom}
          baseZoom={this.baseZoom}
          zoom={zoom}
          bounds={this.bounds}
          tileSize={this.getTileSize()}
          onMoveStart={this.handleMoveStart}
          onMoveEnd={this.handleMoveEnd}
          onZoomEnd={this.handleZoomEnd}
          onSelect={onSelect}
          marker={marker}
        />
      </div>
    ) : (
      <Loader active size="massive" />
    )
  }
}
