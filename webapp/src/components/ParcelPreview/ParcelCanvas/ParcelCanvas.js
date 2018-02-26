import React from 'react'
import PropTypes from 'prop-types'
import { parcelType } from 'components/types'
import debounce from 'lodash.debounce'
import { buildCoordinate } from 'lib/utils'
import { getParcelAttributes, drawMarker } from 'lib/parcelUtils'

export default class ParcelPreview extends React.PureComponent {
  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    size: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    parcels: PropTypes.objectOf(parcelType),
    debounce: PropTypes.number
  }

  static defaultProps = {
    size: 20,
    width: 100,
    height: 100,
    debounce: 400
  }

  constructor(props) {
    super(props)
    this.state = this.getDimensions(props)
    this.oldState = this.state
    this.shouldRefreshMap = false
    this.canvas = null
    this.debouncedRenderMap = debounce(this.renderMap, this.props.debounce)
    this.cache = {}
  }

  getDimensions({ width, height, size, x, y }) {
    const dimensions = {
      width: Math.ceil(width / size + 2),
      height: Math.ceil(height / size + 2)
    }
    dimensions.nw = {
      x: x - Math.ceil(dimensions.width / 2),
      y: y - Math.ceil(dimensions.height / 2)
    }
    dimensions.se = {
      x: x + Math.ceil(dimensions.width / 2),
      y: y + Math.ceil(dimensions.height / 2)
    }
    return dimensions
  }

  clearCache() {
    this.cache = {}
  }

  componentWillReceiveProps(nextProps) {
    const { x, y, parcels, width, height, onFetchParcels } = this.props
    const newState = this.getDimensions(nextProps)

    // The coords or the amount of parcels changed, so we need to re-fetch and update state
    if (
      nextProps.x !== x ||
      nextProps.y !== y ||
      !this.oldState ||
      newState.width !== this.oldState.width ||
      newState.height !== this.oldState.height
    ) {
      const { nw, se } = newState
      if (!this.inStore(nw, se, nextProps.parcels)) {
        onFetchParcels(nw, se)
      }
      this.oldState = newState
      this.setState(newState)
    }

    // The dimensions of the canvas or the parcels data changed, so we need to repaint
    if (nextProps.parcels !== parcels) {
      this.clearCache()
      this.shouldRefreshMap = true
    } else if (nextProps.width !== width || nextProps.height !== height) {
      this.shouldRefreshMap = true
    }
  }

  inStore(nw, se, parcels) {
    if (!parcels) {
      return false
    }
    for (let x = nw.x; x < se.x; x++) {
      for (let y = nw.y; y < se.y; y++) {
        const parcelId = buildCoordinate(x, y)
        if (!parcels[parcelId]) {
          return false
        }
      }
    }

    return true
  }

  componentDidUpdate() {
    if (this.shouldRefreshMap) {
      this.shouldRefreshMap = false
      this.debouncedRenderMap()
    }
    this.oldState = this.state
  }

  componentDidMount() {
    this.renderMap()
  }

  renderMap() {
    if (!this.canvas) {
      return '🦄'
    }
    const { width, height, x, y, size, wallet, districts, parcels } = this.props
    const { nw, se } = this.state
    const ctx = this.canvas.getContext('2d')
    ctx.clearRect(0, 0, width, height)
    let marker = null
    for (let px = nw.x; px < se.x; px++) {
      for (let py = nw.y; py < se.y; py++) {
        const cx = width / 2
        const cy = height / 2
        const offsetX = (x - px) * size
        const offsetY = (py - y) * size
        const rx = cx - offsetX
        const ry = cy - offsetY

        const parcelId = buildCoordinate(px, py)
        const { backgroundColor } = this.cache[parcelId]
          ? this.cache[parcelId]
          : (this.cache[parcelId] = getParcelAttributes(
              wallet,
              parcels[parcelId],
              districts
            ))
        const isCenter = px === x && py === y
        if (isCenter) {
          marker = { x: rx, y: ry }
        }
        ctx.fillStyle = backgroundColor
        ctx.fillRect(rx - size / 2, ry - size / 2, size - 1, size - 1)
      }
    }
    drawMarker(ctx, marker.x, marker.y, 2)
  }

  refCanvas = canvas => {
    this.canvas = canvas
  }

  render() {
    const { width, height } = this.props
    return (
      <canvas
        className="ParcelCanvas"
        width={width}
        height={height}
        ref={this.refCanvas}
      />
    )
  }
}
