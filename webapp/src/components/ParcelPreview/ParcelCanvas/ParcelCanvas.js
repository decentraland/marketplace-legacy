import React from 'react'
import PropTypes from 'prop-types'
import { parcelType } from 'components/types'
import debounce from 'lodash.debounce'
import { buildCoordinate } from 'lib/utils'
import { COLORS, getParcelAttributes, inBounds } from 'lib/parcelUtils'
import { Parcel, Selection } from 'lib/render'
import { panzoom } from './utils'

export default class ParcelPreview extends React.PureComponent {
  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    size: PropTypes.number,
    padding: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    parcels: PropTypes.objectOf(parcelType),
    debounce: PropTypes.number
  }

  static defaultProps = {
    size: 20,
    padding: 2,
    width: 100,
    height: 100,
    debounce: 400,
    panX: 0,
    panY: 0,
    zoom: 1,
    minSize: 5,
    maxSize: 40,
    onFetchParcels: () => {}
  }

  constructor(props) {
    super(props)
    const { panX, panY, zoom } = props
    const initialPanZoom = { pan: { x: panX, y: panY }, zoom }
    this.state = this.getDimensions(props, initialPanZoom)
    this.oldState = this.state
    this.shouldRefreshMap = false
    this.canvas = null
    this.debouncedRenderMap = debounce(this.renderMap, this.props.debounce)
    this.debouncedFetchParcels = debounce(this.props.onFetchParcels, 400)
    this.cache = {}
  }

  getDimensions(
    { width, height, size, x, y, minSize, maxSize },
    { pan, zoom }
  ) {
    const zoomedSize = Math.min(Math.max(size * zoom, minSize), maxSize)
    const dimensions = {
      width: Math.ceil(width / zoomedSize + 2),
      height: Math.ceil(height / zoomedSize + 2)
    }
    dimensions.nw = {
      x: x - Math.ceil(dimensions.width / 2) + Math.ceil(pan.x / zoomedSize),
      y: y - Math.ceil(dimensions.height / 2) - Math.ceil(pan.y / zoomedSize)
    }
    dimensions.se = {
      x: x + Math.ceil(dimensions.width / 2) + Math.ceil(pan.x / zoomedSize),
      y: y + Math.ceil(dimensions.height / 2) - Math.ceil(pan.y / zoomedSize)
    }
    return { ...dimensions, pan, zoom }
  }

  clearCache() {
    this.cache = {}
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.onFetchParcels !== this.props.onFetchParcels) {
      this.debouncedFetchParcels = debounce(this.nextProps.onFetchParcels, 100)
    }
    if (nextProps.debounce !== this.props.debounce) {
      this.debouncedRenderMap = debounce(this.renderMap, nextProps.debounce)
    }
  }

  componentWillUpdate(nextProps, nextState) {
    const { x, y, parcels } = this.props
    const newState = this.getDimensions(nextProps, nextState)
    const isViewportDifferent =
      newState.width !== this.oldState.width ||
      newState.height !== this.oldState.height ||
      newState.nw.x !== this.oldState.nw.x ||
      newState.nw.y !== this.oldState.nw.y ||
      newState.se.x !== this.oldState.se.x ||
      newState.se.y !== this.oldState.se.y

    // The coords or the amount of parcels changed, so we need to re-fetch and update state
    if (
      nextProps.x !== x ||
      nextProps.y !== y ||
      !this.oldState ||
      isViewportDifferent
    ) {
      const { nw, se } = newState
      if (!this.inStore(nw, se, nextProps.parcels)) {
        this.debouncedFetchParcels(nw, se)
      }
      this.oldState = newState
      this.setState(newState)
    }

    // The dimensions of the canvas or the parcels data changed, so we need to repaint
    if (nextProps.parcels !== parcels) {
      this.clearCache()
      this.shouldRefreshMap = true
    } else if (isViewportDifferent) {
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
        if (!parcels[parcelId] && inBounds(x, y)) {
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
    this.destroy = panzoom(this.canvas, this.handlePanZoom)
  }

  componentWillUnmount() {
    if (this.destroy) {
      this.destroy()
    }
  }

  handlePanZoom = ({ target, type, dx, dy, dz, x, y, x0, y0 }) => {
    const { pan, zoom } = this.state
    this.setState({
      pan: {
        x: pan.x - dx - dz,
        y: pan.y - dy - dz * 0.01
      },
      zoom: zoom - dz * 0.01
    })
    this.renderMap()
  }

  renderMap() {
    if (!this.canvas) {
      return '🦄'
    }
    const {
      width,
      height,
      x,
      y,
      padding,
      wallet,
      districts,
      parcels,
      minSize,
      maxSize
    } = this.props
    const { nw, se, pan, zoom } = this.state
    const size = Math.min(Math.max(this.props.size * zoom, minSize), maxSize)
    const ctx = this.canvas.getContext('2d')
    ctx.fillStyle = COLORS.background
    ctx.fillRect(0, 0, width, height)
    let selection = null
    console.log('render', `${nw.x},${nw.y}`, `${se.x},${se.y}`)
    for (let px = nw.x; px < se.x; px++) {
      for (let py = nw.y; py < se.y; py++) {
        const cx = width / 2
        const cy = height / 2
        const offsetX = (x - px) * size + pan.x
        const offsetY = (py - y) * size + pan.y
        const rx = cx - offsetX
        const ry = cy - offsetY

        const parcelId = buildCoordinate(px, py)
        const parcel = parcels[parcelId]
        const { backgroundColor } = this.cache[parcelId]
          ? this.cache[parcelId]
          : (this.cache[parcelId] = getParcelAttributes(
              parcelId,
              px,
              py,
              wallet,
              parcels,
              districts
            ))
        const isCenter = px === x && py === y
        if (isCenter) {
          selection = { x: rx, y: ry }
        }
        Parcel.draw({
          ctx,
          x: rx + size / 2,
          y: ry + size / 2,
          size,
          padding,
          color: backgroundColor,
          connectedLeft: parcel ? parcel.connectedLeft : false,
          connectedTop: parcel ? parcel.connectedTop : false,
          connectedTopLeft: parcel ? parcel.connectedTopLeft : false
        })
      }
    }
    if (selection) {
      Selection.draw({
        ctx,
        x: selection.x,
        y: selection.y,
        size: size
      })
    }
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
