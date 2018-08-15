/* eslint-disable */

import React from 'react'
import PropTypes from 'prop-types'
import Minimap from './Minimap'
import Popup from './Popup'
import Controls from './Controls'
import {
  walletType,
  parcelType,
  coordsType,
  districtType,
  publicationType
} from 'components/types'
import debounce from 'lodash.debounce'
import { isMobileWidth } from 'lib/utils'
import {
  getAsset,
  getType,
  getColorByType,
  getOpenPublication
} from 'shared/asset'
import { Map as MapRenderer } from 'shared/map/render'
import { Bounds, Viewport } from 'shared/map'
import { buildCoordinate } from 'shared/parcel'
import { getLabel, getTextColor, getDescription, getConnections } from './utils'
import { panzoom } from './utils'

import './ParcelCanvas.css'

const LOAD_PADDING = 4
const POPUP_ROW_HEIGHT = 19
const POPUP_HEIGHT = 67
const POPUP_PADDING = 20
const POPUP_DELAY = 400

const { minX, minY, maxX, maxY } = Bounds.getBounds()

export default class ParcelPreview extends React.PureComponent {
  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    size: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    wallet: walletType,
    parcels: PropTypes.objectOf(parcelType),
    districts: PropTypes.objectOf(districtType),
    publications: PropTypes.objectOf(publicationType),
    zoom: PropTypes.number,
    minSize: PropTypes.number,
    maxSize: PropTypes.number,
    selected: PropTypes.oneOfType([PropTypes.arrayOf(coordsType), coordsType]),
    debounce: PropTypes.number,
    isDraggable: PropTypes.bool,
    showMinimap: PropTypes.bool,
    showPopup: PropTypes.bool,
    showControls: PropTypes.bool,
    useCache: PropTypes.bool
  }

  static defaultProps = {
    x: 0,
    y: 0,
    size: 14,
    width: 100,
    height: 100,
    zoom: 1,
    minSize: 7,
    maxSize: 40,
    selected: null,
    onFetchMap: () => {},
    onClick: null,
    onHover: (x, y, parcel) => {},
    onChange: viewport => {},
    debounce: 400,
    isDraggable: false,
    showMinimap: false,
    showPopup: false,
    showControls: false,
    useCache: true
  }

  constructor(props) {
    super(props)
    const { x, y, size, zoom } = props
    const initialState = {
      pan: { x: 0, y: 0 },
      center: { x, y },
      size: zoom * size,
      zoom,
      popup: null
    }
    this.state = this.getDimensions(props, initialState)
    this.oldState = this.state
    this.shouldRefreshMap = false
    this.canvas = null
    this.debouncedRenderMap = debounce(this.renderMap, this.props.debounce)
    this.debouncedFetchMap = debounce(this.props.onFetchMap, 400)
    this.debouncedUpdateCenter = debounce(this.updateCenter, 50)
    this.debouncedHandleChange = debounce(this.handleChange, 50)
    this.debouncedHandleMinimapChange = debounce(this.handleMinimapChange, 50)
    this.cache = {}
    this.popupTimeout = null
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
    const { x, y, parcels, useCache, selected } = this.props

    // @cazala: i'm commenting this out cos it makes the parcel detail lagg when you click on parcel in the map
    // the coords changed from props (controlled)
    // if (
    //   (x !== nextProps.x || y !== nextProps.y) &&
    //   (nextProps.x !== nextState.center.x || nextProps.y !== nextState.center.y)
    // ) {
    //   nextState = {
    //     ...nextState,
    //     center: {
    //       x: nextProps.x,
    //       y: nextProps.y
    //     },
    //     pan: {
    //       x: 0,
    //       y: 0
    //     }
    //   }
    // }

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
      if (!this.inStore(nw, se, nextProps.parcels) || !useCache) {
        this.debouncedFetchMap(nw, se)
      }
      this.oldState = newState
      this.setState(newState)
      this.debouncedHandleChange()
    }

    // The dimensions of the canvas or the parcels data changed, so we need to repaint
    if (nextProps.parcels !== parcels) {
      this.clearCache()
    }

    if (selected !== nextProps.selected) {
      this.shouldRefreshMap = true
    }
  }

  inStore(nw, se, parcels) {
    if (!parcels) {
      return false
    }
    for (let x = nw.x; x < se.x; x++) {
      for (let y = se.y; y < nw.y; y++) {
        const parcelId = buildCoordinate(x, y)
        if (!parcels[parcelId] && Bounds.inBounds(x, y)) {
          return false
        }
      }
    }

    return true
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
    this.renderMap()
    const { isDraggable } = this.props
    if (isDraggable) {
      this.destroy = panzoom(this.canvas, this.handlePanZoom)
    }
    this.canvas.addEventListener('click', this.handleClick)
    this.canvas.addEventListener('mousedown', this.handleMouseDown)
    this.canvas.addEventListener('mousemove', this.handleMouseMove)
    this.canvas.addEventListener('mouseout', this.handleMouseOut)
    this.mounted = true
  }

  componentWillUnmount() {
    if (this.destroy) {
      this.destroy()
    }
    this.canvas.removeEventListener('click', this.handleClick)
    this.canvas.removeEventListener('mousedown', this.handleMouseDown)
    this.canvas.removeEventListener('mousemove', this.handleMouseMove)
    this.canvas.removeEventListener('mouseout', this.handleMouseOut)
    this.mounted = false
  }

  handleChange = () => {
    const { onChange } = this.props
    const { nw, se, center, zoom } = this.state
    onChange({ nw, se, center, zoom })
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

    const parcelId = buildCoordinate(x, y)
    const { onClick, parcels, estates } = this.props
    const { asset, selectedParcel } = getAsset(parcelId, parcels, estates)

    if (onClick && Date.now() - this.mousedownTimestamp < 200) {
      onClick(asset, selectedParcel)
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

    if (!this.hovered || this.hovered.x !== x || this.hovered.y !== y) {
      this.hovered = { x, y }
      const parcelId = buildCoordinate(x, y)
      const { onHover, parcels, showPopup } = this.props
      const parcel = parcels[parcelId]

      if (onHover) {
        onHover(x, y, parcel)
      }
      if (showPopup) {
        this.hidePopup()
        this.popupTimeout = setTimeout(() => {
          if (this.mounted) {
            this.setState({
              popup: {
                x,
                y,
                top: layerY,
                left: layerX,
                visible: true
              }
            })
          }
        }, POPUP_DELAY)
      }
    }
  }

  handleMouseOut = () => {
    this.hidePopup()
  }

  hidePopup = () => {
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

    if (this.cache[parcelId]) {
      return this.cache[parcelId]
    }

    const { wallet, parcels, districts, publications, estates } = this.props
    const { asset } = getAsset(parcelId, parcels, estates)
    const publication = getOpenPublication(asset, publications)

    const type = getType(asset, publications, wallet)
    const color = getTextColor(type)
    const label = getLabel(type, asset, districts)
    const description = getDescription(type, asset)
    const backgroundColor = getColorByType(type, x, y)
    const connections = getConnections(asset)

    const result = {
      id: parcelId,
      publication,
      color,
      label,
      description,
      backgroundColor,
      ...connections
    }

    this.cache[parcelId] = result
    return result
  }

  getSelected() {
    const { selected } = this.props
    if (Array.isArray(selected)) {
      return selected
    }
    return selected ? [selected] : []
  }

  renderMap() {
    if (!this.canvas) {
      return '🦄'
    }
    const { width, height, parcels, publications, wallet, estates } = this.props

    const { nw, se, pan, size, center } = this.state
    const ctx = this.canvas.getContext('2d')

    MapRenderer.draw({
      ctx,
      width,
      height,
      size,
      pan,
      nw,
      se,
      center,
      parcels,
      estates,
      publications,
      selected: this.getSelected(),
      wallet
    })
  }

  computeParcelPadding(size) {
    return size < 7 ? 0.5 : size < 12 ? 1 : size < 18 ? 1.5 : 2
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
      publication
    } = this.getParcelAttributes(x, y)

    let rows = 1
    if (label) rows += 1
    if (publication) rows += 1

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
          publication={publication}
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
