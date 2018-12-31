/* eslint-disable */

import React from 'react'
import PropTypes from 'prop-types'
import debounce from 'lodash.debounce'

import { coordsType } from 'components/types'
import { isMobileWidth } from 'lib/utils'
import { getOpenPublication, ASSET_TYPES } from 'shared/asset'
import { buildCoordinate } from 'shared/coordinates'
import {
  TYPES,
  COLORS,
  Bounds,
  Viewport,
  getLoadingColor,
  getBackgroundColor,
  getTextColor
} from 'shared/map'
import { Map as MapRenderer } from 'shared/map/render'
import { isParcel, isEstate } from 'shared/parcel'
import { getLabel, getDescription, panzoom } from './utils'
import Minimap from './Minimap'
import Popup from './Popup'
import Controls from './Controls'

import './ParcelCanvas.css'

const LOAD_PADDING = 4
const POPUP_ROW_HEIGHT = 19
const POPUP_HEIGHT = 67
const POPUP_PADDING = 20
const POPUP_DELAY = 400

const { minX, minY, maxX, maxY } = Bounds.getBounds()

export default class ParcelPreview extends React.PureComponent {
  // We also have a 'tiles' prop which is an object of 'tilesType'. We don't check it here because it takes up to 6 seconds
  static propTypes = {
    /** where to position the map in the X axis */
    x: PropTypes.number,
    /** where to position the map in the Y axis */
    y: PropTypes.number,
    /** where to position the map in the X axis */
    initialX: PropTypes.number,
    /** where to position the map in the Y axis */
    initialY: PropTypes.number,
    /** size of each parcel, i.e: size=5 makes each parcel of 5x5 pixels */
    size: PropTypes.number,
    /** width of the canvas in pixels */
    width: PropTypes.number,
    /** height of the canvas in pixels */
    height: PropTypes.number,
    /** zoom level of the map, this changes in the end the size on which parcels are rendered, i.e: size=10 and zoom=0.5 makes each parcel of 5x5 pixels */
    zoom: PropTypes.number,
    /** minimum size that parcels can take (after applying zoom) */
    minSize: PropTypes.number,
    /** maximum size that parcels can take (after applying zoom) */
    maxSize: PropTypes.number,
    /** initial panning in the X axis, this changes the initial position of the map adding an offset to the prop `x` */
    panX: PropTypes.number,
    /** initial panning in the Y axis, this changes the initial position of the map adding an offset to the prop `y` */
    panY: PropTypes.number,
    /** array of coords { x, y } that will be highlighted as selected */
    selected: PropTypes.oneOfType([PropTypes.arrayOf(coordsType), coordsType]),
    /** debounce in milliseconds used to fetch the map after a user interaction (panning or zooming) */
    debounce: PropTypes.number,
    /** whether the map should be draggable or not */
    isDraggable: PropTypes.bool,
    /** whether to show or not the minimap */
    showMinimap: PropTypes.bool,
    /** whether to show or not the popup */
    showPopup: PropTypes.bool,
    /** whether to show or not the zoom/recenter controls */
    showControls: PropTypes.bool
  }

  static defaultProps = {
    initialX: 0,
    initialY: 0,
    size: 14,
    width: 100,
    height: 100,
    zoom: 1,
    minSize: 7,
    maxSize: 40,
    panX: 0,
    panY: 0,
    selected: null,
    onClick: null,
    onChange: viewport => {},
    debounce: 400,
    isDraggable: false,
    showMinimap: false,
    showPopup: false,
    showControls: false
  }

  constructor(props) {
    super(props)

    const { x, y, initialX, initialY, size, zoom, panX, panY } = props
    const initialState = {
      pan: { x: panX, y: panY },
      center: {
        x: x == null ? initialX : x,
        y: y == null ? initialY : y
      },
      size: zoom * size,
      zoom,
      popup: null
    }
    this.state = this.getDimensions(props, initialState)
    this.oldState = this.state
    this.shouldRefreshMap = false
    this.isHovered = false
    this._isMounted = false
    this.canvas = null
    this.popupTimeout = null
    this.debouncedFetchNewTiles = debounce(this.props.onFetchNewTiles, 400)
    this.debouncedRenderMap = debounce(this.renderMap, this.props.debounce)
    this.debouncedUpdateCenter = debounce(this.updateCenter, 50)
    this.debouncedHandleChange = debounce(this.handleChange, 50)
    this.debouncedHandleMinimapChange = debounce(this.handleMinimapChange, 50)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.debounce !== this.props.debounce) {
      this.debouncedRenderMap = debounce(this.renderMap, nextProps.debounce)
    }
  }

  componentWillUpdate(nextProps, nextState) {
    const { x, y, selected } = this.props

    if (
      (x !== nextProps.x || y !== nextProps.y) &&
      (nextProps.x !== nextState.center.x || nextProps.y !== nextState.center.y)
    ) {
      nextState = {
        ...nextState,
        center: {
          x: nextProps.x,
          y: nextProps.y
        },
        pan: {
          x: 0,
          y: 0
        }
      }
    }

    const newState = this.getDimensions(nextProps, nextState)
    const isViewportDifferent =
      newState.width !== this.oldState.width ||
      newState.height !== this.oldState.height ||
      newState.nw.x !== this.oldState.nw.x ||
      newState.nw.y !== this.oldState.nw.y ||
      newState.se.x !== this.oldState.se.x ||
      newState.se.y !== this.oldState.se.y

    // The coords or the amount of parcels changed, so we need to update the state
    if (
      nextProps.x !== x ||
      nextProps.y !== y ||
      !this.oldState ||
      isViewportDifferent
    ) {
      const { nw, se } = newState
      this.oldState = newState
      this.setState(newState)
      this.debouncedHandleChange()
      this.debouncedFetchNewTiles(Date.now())
    }

    if (selected !== nextProps.selected) {
      this.shouldRefreshMap = true
    }
  }

  componentDidUpdate() {
    if (this.shouldRefreshMap) {
      this.shouldRefreshMap = false
      this.renderMap()
    } else {
      this.debouncedRenderMap()
    }
    this.oldState = this.state
  }

  componentDidMount() {
    const { isDraggable } = this.props

    this.renderMap()
    if (isDraggable) {
      this.destroy = panzoom(this.canvas, this.handlePanZoom)
    }
    this.canvas.addEventListener('click', this.handleClick)
    this.canvas.addEventListener('mousedown', this.handleMouseDown)
    this.canvas.addEventListener('mousemove', this.handleMouseMove)
    this.canvas.addEventListener('mouseout', this.handleMouseOut)
    this._isMounted = true
  }

  componentWillUnmount() {
    if (this.destroy) {
      this.destroy()
    }
    this.canvas.removeEventListener('click', this.handleClick)
    this.canvas.removeEventListener('mousedown', this.handleMouseDown)
    this.canvas.removeEventListener('mousemove', this.handleMouseMove)
    this.canvas.removeEventListener('mouseout', this.handleMouseOut)
    this._isMounted = false
  }

  getDimensions({ width, height }, { pan, zoom, center, size }) {
    const dimensions = Viewport.getDimensions({
      width,
      height,
      center,
      pan,
      size,
      padding: LOAD_PADDING
    })
    return { ...dimensions, pan, zoom, center, size }
  }

  handleChange = () => {
    const { onChange } = this.props
    const { nw, se, center, zoom } = this.state
    if (this._isMounted) {
      onChange({ nw, se, center, zoom })
    }
  }

  handlePanZoom = ({ dx, dy, dz }) => {
    const { size, maxSize, minSize } = this.props
    const { pan, zoom } = this.state

    const maxZoom = maxSize / size
    const minZoom = minSize / size

    const newPan = { x: pan.x - dx, y: pan.y - dy }
    const newZoom = Math.max(
      minZoom,
      Math.min(maxZoom, zoom - dz * this.getDzZoomModifier())
    )
    const newSize = newZoom * size

    const halfWidth = (this.state.width - LOAD_PADDING) / 2
    const halfHeight = (this.state.height - LOAD_PADDING) / 2

    const boundaries = {
      nw: { x: minX - halfWidth, y: maxY + halfHeight },
      se: { x: maxX + halfWidth, y: minY - halfHeight }
    }

    const viewport = {
      nw: {
        x: this.state.center.x - halfWidth,
        y: this.state.center.y + halfHeight
      },
      se: {
        x: this.state.center.x + halfWidth,
        y: this.state.center.y - halfHeight
      }
    }

    if (viewport.nw.x + newPan.x / newSize < boundaries.nw.x) {
      newPan.x = (boundaries.nw.x - viewport.nw.x) * newSize
    }
    if (viewport.nw.y - newPan.y / newSize > boundaries.nw.y) {
      newPan.y = (viewport.nw.y - boundaries.nw.y) * newSize
    }
    if (viewport.se.x + newPan.x / newSize > boundaries.se.x) {
      newPan.x = (boundaries.se.x - viewport.se.x) * newSize
    }
    if (viewport.se.y - newPan.y / newSize < boundaries.se.y) {
      newPan.y = (viewport.se.y - boundaries.se.y) * newSize
    }

    this.setState({
      pan: newPan,
      zoom: newZoom,
      size: newSize
    })
    this.renderMap()
    this.debouncedUpdateCenter()
  }

  mouseToCoords(x, y) {
    const { size, pan, center, width, height } = this.state

    const panOffset = { x: (x + pan.x) / size, y: (y + pan.y) / size }

    const viewportOffset = {
      x: (width - LOAD_PADDING - 0.5) / 2 - center.x,
      y: (height - LOAD_PADDING) / 2 + center.y
    }

    const coordX = Math.round(panOffset.x - viewportOffset.x)
    const coordY = Math.round(viewportOffset.y - panOffset.y)

    return [coordX, coordY]
  }

  handleClick = event => {
    const [x, y] = this.mouseToCoords(event.layerX, event.layerY)
    if (!Bounds.inBounds(x, y)) {
      return
    }

    const { onClick, tiles } = this.props

    const parcelId = buildCoordinate(x, y)
    const tile = tiles[parcelId]

    if (tile != null && onClick && Date.now() - this.mousedownTimestamp < 200) {
      onClick({
        id: tile.estate_id || parcelId,
        x,
        y,
        type: tile.type,
        assetType: tile.estate_id ? ASSET_TYPES.estate : ASSET_TYPES.parcel
      })
    }
  }

  handleMouseDown = () => {
    this.mousedownTimestamp = Date.now()
  }

  handleMouseMove = event => {
    const { layerX, layerY } = event
    const [x, y] = this.mouseToCoords(layerX, layerY)
    if (!Bounds.inBounds(x, y)) {
      this.hidePopup()
      return
    }

    if (!this.isHovered || this.isHovered.x !== x || this.isHovered.y !== y) {
      this.isHovered = { x, y }
      this.showPopup(x, y, layerY, layerX)
    }
  }

  handleMouseOut = () => {
    this.hidePopup()
  }

  showPopup(x, y, top, left) {
    const { showPopup } = this.props

    if (showPopup) {
      this.hidePopup()
      this.popupTimeout = setTimeout(() => {
        if (this._isMounted) {
          this.setState({
            popup: { x, y, top, left, visible: true }
          })
        }
      }, POPUP_DELAY)
    }
  }

  hidePopup() {
    clearTimeout(this.popupTimeout)

    if (this.state.popup) {
      this.setState({
        popup: {
          ...this.state.popup,
          visible: false
        }
      })
    }
  }

  updateCenter = () => {
    const { pan, center, size } = this.state

    const panX = pan.x % size
    const panY = pan.y % size
    const newPan = { x: panX, y: panY }
    const newCenter = {
      x: center.x + Math.floor((pan.x - panX) / size),
      y: center.y - Math.floor((pan.y - panY) / size)
    }

    this.setState({
      pan: newPan,
      center: newCenter
    })
  }

  getParcelAttributes = (x, y) => {
    const parcelId = buildCoordinate(x, y)

    const { tiles } = this.props
    const tile = tiles[parcelId] || {
      type: TYPES.loading,
      label: getLabel('', TYPES.loading),
      color: getLoadingColor(x, y)
    }

    const { type, name, price, owner, left, top, topLeft } = tile

    const label = getLabel(name, type)
    const description = getDescription(type, owner)
    const backgroundColor = getBackgroundColor(type)
    const color = getTextColor(type)

    const result = {
      id: parcelId,
      connectedTop: top,
      connectedLeft: left,
      connectedTopLeft: topLeft,
      price,
      color,
      label,
      description,
      backgroundColor
    }

    return result
  }

  getSelected() {
    const selected = this.props.selected || []
    return Array.isArray(selected) ? selected : [selected]
  }

  renderMap() {
    if (!this.canvas) {
      return '🦄'
    }
    const { width, height, tiles, getColors } = this.props
    const { nw, se, pan, size, center } = this.state
    const ctx = this.canvas.getContext('2d')

    // TODO: Cache this instance?
    new MapRenderer(ctx, {
      width,
      height,
      size,
      pan,
      colors: typeof getColors === 'function' ? getColors() : COLORS
    }).draw({
      nw,
      se,
      center,
      tiles,
      selected: this.getSelected()
    })
  }

  renderPopup() {
    const { width } = this.props
    const { popup } = this.state
    if (!popup) return null

    const { x, y, top, left, visible } = popup
    if (!x && !y && !top && !left) return null

    const {
      color,
      label,
      backgroundColor,
      description,
      price
    } = this.getParcelAttributes(x, y)

    let rows = 1
    if (label) rows += 1
    if (price) rows += 1

    const popupHeight = rows * POPUP_ROW_HEIGHT + POPUP_HEIGHT + POPUP_PADDING
    const popupTop = popupHeight > top ? top + POPUP_PADDING : top - popupHeight

    let popupClasses = 'ParcelCanvasPopup'
    if (left > width * 0.8) {
      popupClasses += ' move-left'
    } else if (left < width * 0.2) {
      popupClasses += ' move-right'
    }
    if (visible) {
      popupClasses += ' visible'
    }

    return (
      <div className={popupClasses} style={{ top: popupTop, left }}>
        <Popup
          x={x}
          y={y}
          color={color}
          backgroundColor={backgroundColor}
          label={label}
          description={description}
          price={price}
        />
      </div>
    )
  }

  refCanvas = canvas => {
    this.canvas = canvas
  }

  handleMinimapChange = (x, y) => {
    this.setState({ center: { x, y } })
  }

  handleTarget = () => {
    const { x, y } = this.getSelected()[0]
    this.setState({ center: { x, y } })
  }

  handleZoomIn = () => {
    this.handlePanZoom({
      dx: 0,
      dy: 0,
      dz: -1 * this.getDz()
    })
  }

  handleZoomOut = () => {
    this.handlePanZoom({
      dx: 0,
      dy: 0,
      dz: this.getDz()
    })
  }

  getDz() {
    const { zoom } = this.state
    return Math.sqrt(zoom) * (this.isMobile() ? 100 : 50)
  }

  getDzZoomModifier() {
    return this.isMobile() ? 0.005 : 0.01
  }

  isMobile() {
    return isMobileWidth(this.props.width)
  }

  getCanvasClassName() {
    const { isDraggable, onClick } = this.props

    let classes = 'ParcelCanvas'
    if (isDraggable) classes += ' draggable'
    if (onClick) classes += ' clickable'

    return classes
  }

  render() {
    const {
      width,
      height,
      showMinimap,
      showPopup,
      showControls,
      minSize,
      maxSize
    } = this.props

    const styles = { width, height }

    return (
      <div className="ParcelCanvasWrapper" style={styles}>
        <canvas
          className={this.getCanvasClassName()}
          width={width}
          height={height}
          ref={this.refCanvas}
        />
        {this.isMobile() || !showPopup ? null : this.renderPopup()}
        {this.isMobile() || !showMinimap ? null : (
          <Minimap
            width={this.state.width - LOAD_PADDING}
            height={this.state.height - LOAD_PADDING}
            center={this.state.center}
            onChange={this.debouncedHandleMinimapChange}
          />
        )}
        {!showControls ? null : (
          <Controls
            target={this.getSelected()[0]}
            center={this.state.center}
            size={this.state.size}
            minSize={minSize}
            maxSize={maxSize}
            onTarget={this.handleTarget}
            onZoomIn={this.handleZoomIn}
            onZoomOut={this.handleZoomOut}
          />
        )}
      </div>
    )
  }
}
