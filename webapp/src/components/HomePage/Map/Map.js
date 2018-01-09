import React from 'react'
import PropTypes from 'prop-types'
import locations from 'locations'
import * as parcelUtils from 'lib/parcelUtils'

import ParcelsMap from './ParcelsMap'
import Loading from 'components/Loading'

export default class MapComponent extends React.Component {
  static propTypes = {
    isReady: PropTypes.bool,
    center: PropTypes.shape({
      x: PropTypes.string,
      y: PropTypes.string
    }),
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
    this.baseTileSize = 128

    this.state = {
      zoom: this.baseZoom - 1
    }
  }

  getCenter() {
    const { x, y } = this.props.center
    return {
      x: parseInt(x, 10) || 0,
      y: parseInt(y, 10) || 0
    }
  }

  onMoveStart = () => {
    const { onLoading } = this.props
    onLoading() // Set back to false on `types.fetchParcels.success`
  }

  onMoveEnd = ({ position, bounds }) => {
    const { onNavigate } = this.props
    const offset = this.getBoundsOffset()

    this.fetchParcelRange(
      bounds.min.x + offset,
      bounds.min.y + offset,
      bounds.max.x - offset,
      bounds.max.y - offset
    )

    onNavigate(locations.parcelDetail(position.x, position.y))
  }

  onZoomEnd = zoom => {
    this.setState({ zoom })
  }

  fetchParcelRange(minX, minY, maxX, maxY) {
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
    onRangeChange(nw, se)
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
    const { isReady, onSelect } = this.props
    const { x, y } = this.getCenter()

    return isReady ? (
      <ParcelsMap
        x={x}
        y={y}
        minZoom={this.baseZoom - 4}
        maxZoom={this.baseZoom}
        baseZoom={this.baseZoom}
        zoom={zoom}
        bounds={this.bounds}
        tileSize={this.getTileSize()}
        onMoveStart={this.onMoveStart}
        onMoveEnd={this.onMoveEnd}
        onZoomEnd={this.onZoomEnd}
        onSelect={onSelect}
      />
    ) : (
      <Loading />
    )
  }
}
