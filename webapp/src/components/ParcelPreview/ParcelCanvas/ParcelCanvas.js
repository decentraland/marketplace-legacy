import React from 'react'
import PropTypes from 'prop-types'
import { parcelType, coordsType } from 'components/types'
import debounce from 'lodash.debounce'
import { buildCoordinate } from 'lib/utils'
import { COLORS, getParcelAttributes, inBounds } from 'lib/parcelUtils'
import { Parcel, Selection } from 'lib/render'
import { panzoom } from './utils'

const PADDING = 4

export default class ParcelPreview extends React.PureComponent {
  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    size: PropTypes.number,
    padding: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    parcels: PropTypes.objectOf(parcelType),
    zoom: PropTypes.number,
    minSize: PropTypes.number,
    maxSize: PropTypes.number,
    selected: PropTypes.oneOfType([PropTypes.arrayOf(coordsType), coordsType]),
    debounce: PropTypes.number
  }

  static defaultProps = {
    x: 0,
    y: 0,
    size: 20,
    padding: 2,
    width: 100,
    height: 100,
    zoom: 1,
    minSize: 5,
    maxSize: 40,
    selected: null,
    onFetchParcels: () => {},
    onClick: () => {},
    onHover: () => {},
    debounce: 400
  }

  constructor(props) {
    super(props)
    const { x, y, size, zoom } = props
    const initialState = {
      pan: { x: 0, y: 0 },
      center: { x, y },
      size: zoom * size,
      zoom
    }
    this.state = this.getDimensions(props, initialState)
    this.oldState = this.state
    this.shouldRefreshMap = false
    this.canvas = null
    this.debouncedRenderMap = debounce(this.renderMap, this.props.debounce)
    this.debouncedFetchParcels = debounce(this.props.onFetchParcels, 400)
    this.debouncedUpdateCenter = debounce(this.updateCenter, 50)
    this.cache = {}
  }

  getDimensions({ width, height }, { pan, zoom, center, size }) {
    const dimensions = {
      width: Math.ceil(width / size + PADDING),
      height: Math.ceil(height / size + PADDING)
    }
    dimensions.nw = {
      x: center.x - Math.ceil(dimensions.width / 2) + Math.ceil(pan.x / size),
      y: center.y - Math.ceil(dimensions.height / 2) - Math.ceil(pan.y / size)
    }
    dimensions.se = {
      x: center.x + Math.ceil(dimensions.width / 2) + Math.ceil(pan.x / size),
      y: center.y + Math.ceil(dimensions.height / 2) - Math.ceil(pan.y / size)
    }
    return { ...dimensions, pan, zoom, center, size }
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
    this.canvas.addEventListener('click', this.handleClick)
    this.canvas.addEventListener('mousemove', this.handleMouseMove)
  }

  componentWillUnmount() {
    if (this.destroy) {
      this.destroy()
    }
  }

  handlePanZoom = ({ target, type, dx, dy, dz, x, y, x0, y0 }) => {
    const { size, maxSize, minSize } = this.props
    const { pan, zoom } = this.state
    const maxZoom = maxSize / size
    const minZoom = minSize / size

    const newPan = {
      x: pan.x - dx,
      y: pan.y - dy
    }
    const newZoom = Math.max(minZoom, Math.min(maxZoom, zoom - dz * 0.01))
    const newSize = newZoom * size

    this.setState({
      pan: newPan,
      zoom: newZoom,
      size: newSize
    })
    this.renderMap()
    this.debouncedUpdateCenter()
  }

  mouseToCoords(x, y) {
    const { nw, size, pan } = this.state
    const half = PADDING / 2
    const coordX = Math.ceil(half + nw.x + (x - pan.x) / size)
    const coordY = Math.ceil(half + nw.y + (y - pan.y) / size)
    return [coordX, coordY]
  }

  handleClick = event => {
    console.log('click', this.mouseToCoords(event.layerX, event.layerY))
  }

  handleMouseMove = event => {
    const [x, y] = this.mouseToCoords(event.layerX, event.layerY)
    if (!this.hovered || this.hovered.x !== x || this.hovered.y !== y) {
      this.hovered = { x, y }
      console.log('hover', x, y)
    }
  }

  updateCenter = () => {
    const { pan, center, size } = this.state

    const panX = pan.x % size
    const panY = pan.y % size
    const newPan = {
      x: panX,
      y: panY
    }
    const newCenter = {
      x: center.x + Math.floor((pan.x - panX) / size),
      y: center.y - Math.floor((pan.y - panY) / size)
    }

    this.setState({
      pan: newPan,
      center: newCenter
    })
  }

  renderMap() {
    if (!this.canvas) {
      return '🦄'
    }
    const { width, height, padding, wallet, districts, parcels } = this.props
    let { selected } = this.props
    const { nw, se, pan, size, center } = this.state
    const { x, y } = center
    const ctx = this.canvas.getContext('2d')
    ctx.fillStyle = COLORS.background
    ctx.fillRect(0, 0, width, height)

    let selection = []
    if (selected && !Array.isArray(selected)) {
      selected = [selected]
    }

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

        if (
          selected &&
          selected.some(coords => coords.x === px && coords.y === py)
        ) {
          selection.push({ x: rx, y: ry })
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
    if (selection.length > 0) {
      Selection.draw({
        ctx,
        selection,
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
