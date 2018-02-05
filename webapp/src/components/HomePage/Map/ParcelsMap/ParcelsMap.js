import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import L from 'leaflet'
import debounce from 'lodash.debounce'
import isEqual from 'lodash/isEqual'

import { LeafletMapCoordinates } from 'lib/LeafletMapCoordinates'
import { LeafletParcelGrid } from 'lib/LeafletParcelGrid'

import { walletType, parcelType, districtType } from 'components/types'

import ParcelPopup from './ParcelPopup'
import { buildCoordinate, requestAnimationFrame } from 'lib/utils'
import { getParcelAttributes } from 'lib/parcelUtils'

import './ParcelsMap.css'

const MAP_ID = 'map'

L.Icon.Default.imagePath = 'https://cdnjs.com/ajax/libs/leaflet/1.0.3/images/'

export default class ParcelsMap extends React.Component {
  static propTypes = {
    wallet: walletType.isRequired,
    parcels: PropTypes.objectOf(parcelType).isRequired,
    districts: PropTypes.objectOf(districtType).isRequired,
    center: PropTypes.shape({
      x: PropTypes.string,
      y: PropTypes.string
    }),

    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    bounds: PropTypes.arrayOf(PropTypes.array),

    minZoom: PropTypes.number.isRequired,
    maxZoom: PropTypes.number.isRequired,
    baseZoom: PropTypes.number.isRequired,
    zoom: PropTypes.number.isRequired,
    tileSize: PropTypes.number.isRequired,

    onMoveEnd: PropTypes.func.isRequired,
    onZoomEnd: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    onHover: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.debouncedHandleHover = debounce(this.handleHover, 400)
  }

  static defaultProps = {
    bounds: [[], []],
    onMoveEnd: () => {},
    onZoomEnd: () => {}
  }

  componentWillMount() {
    this.map = null
    this.parcelGrid = null
    this.mapCoordinates = null

    this.debounceMapMethodsByTileSize(this.props.tileSize)
  }

  componentWillUnmount() {
    this.removeMap()
  }

  componentWillReceiveProps(nextProps) {
    const shouldUpdateCenter =
      !this.panInProgress &&
      (this.props.x !== nextProps.x || this.props.y !== nextProps.y)

    const shouldRedraw = !!this.map

    const shouldDebounce = this.props.tileSize !== nextProps.tileSize

    if (shouldUpdateCenter) {
      if (this.skipCenter) {
        this.skipCenter = false
      } else {
        const newCenter = this.getLatLng(nextProps.x, nextProps.y)
        this.recenterMap(newCenter)
      }
    }

    if (shouldRedraw) {
      this.debouncedRedrawMap()
    }

    if (shouldDebounce) {
      this.debounceMapMethodsByTileSize(nextProps.tileSize)
    }
  }

  shouldPopupUpdate = nextProps => {
    if (this.popup && this.tileHovered) {
      // check if the land data has changed in order to update the popup
      const { x, y } = this.tileHovered
      const coords = buildCoordinate(x, y)
      const nextParcel = nextProps.parcels[coords]
      const currentParcel = this.props.parcels[coords]
      const nextParcelData = (nextParcel && nextParcel.data) || null
      const currentParcelData = (currentParcel && currentParcel.data) || null
      const isDataDifferent = !isEqual(nextParcelData, currentParcelData)
      if (isDataDifferent) {
        return true
      }
      // check if my wallet data has changed in order to update the popup
      const isWalletDifferent = this.props.wallet != nextProps.wallet
      return isWalletDifferent
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.shouldPopupUpdate(nextProps)) {
      const { x, y } = this.tileHovered
      const { wallet, parcels, districts } = nextProps
      this.renderPopup(x, y, wallet, parcels, districts)
    }
    return this.props.tileSize !== nextProps.tileSize
  }

  debounceMapMethodsByTileSize(tileSize) {
    const delay = 6400
    this.debouncedRedrawMap = debounce(
      this.redrawMap,
      Math.min(200, delay / tileSize)
    )
    this.debouncedMoveEnd = debounce(
      this.handleMoveEnd,
      Math.min(200, delay / tileSize)
    )
  }

  createMap(container) {
    const { x, y, tileSize, minZoom, maxZoom, bounds, zoom } = this.props

    this.map = new L.Map(MAP_ID, {
      minZoom,
      maxZoom,
      zoom,
      center: new L.LatLng(0, 0),
      layers: [],
      zoomAnimation: false,
      scrollWheelZoom: false,
      boxZoom: false,
      doubleClickZoom: false
    })

    this.mapCoordinates = new LeafletMapCoordinates(this.map, tileSize)

    this.parcelGrid = new LeafletParcelGrid({
      getTileAttributes: this.getTileAttributesFromLatLng,
      onTileClick: this.handleTileClick,
      onMouseDown: this.handleMousedown,
      onMouseUp: this.handleMouseUp,
      onMouseMove: this.handleMouseMove,
      tileSize: tileSize
    })

    this.map.zoomControl.setPosition('topright')
    this.map.setMaxBounds(this.mapCoordinates.toLatLngBounds(bounds))
    this.map.addLayer(this.parcelGrid)
    this.map.setView(this.getLatLng(x, y))

    if (!this.isNearTheCenter()) {
      // Only trigger this outside the bounds of the center,
      // 0,0 and it's surroundings are always fetched on load.
      this.handleMapMoveEnd()
    }

    this.attachMapEvents()

    return this.map
  }

  attachMapEvents() {
    this.map.on('movestart', this.handleMapMoveStart)
    this.map.on('moveend', this.handleMapMoveEnd)
    this.map.on('zoomend', this.handleMapZoomEnd)
  }

  recenterMap(center) {
    this.map.setView(center)
    this.redrawMap()
  }

  redrawMap = () => {
    if (this.map) {
      this.parcelGrid.renderTiles(this.map.getBounds())
    }
  }

  handleMapMoveStart = () => {
    this.panInProgress = true
    this.startMove = Date.now()
    this.props.onMoveStart()
  }

  handleMapMoveEnd = () => {
    const elapsed = Date.now() - this.startMove
    this.panInProgress = false
    if (elapsed > 500) {
      this.skipCenter = true
    }
    this.debouncedMoveEnd()
  }

  handleMapZoomEnd = () => {
    this.props.onZoomEnd(this.map.getZoom())
    this.debouncedMoveEnd()
  }

  handleMoveEnd = () => {
    if (this.map) {
      this.props.onMoveEnd(this.getCurrentPositionAndBounds())
    }
  }

  getCurrentPositionAndBounds() {
    const bounds = { min: {}, max: {} }
    const latlng = this.map.getCenter()
    const position = this.mapCoordinates.latLngToCartesian(latlng)
    const mapBounds = this.map.getBounds()

    const sw = this.mapCoordinates.latLngToCartesian(mapBounds.getSouthWest())
    const ne = this.mapCoordinates.latLngToCartesian(mapBounds.getNorthEast())

    bounds.min = {
      x: sw.x,
      y: sw.y
    }

    bounds.max = {
      x: ne.x,
      y: ne.y
    }

    return { position, bounds }
  }

  isNearTheCenter() {
    const { x, y } = this.props
    return x >= -20 && x <= 20 && y >= -12 && y <= 12
  }

  getLatLng(x, y) {
    return this.mapCoordinates.cartesianToLatLng({ x, y })
  }

  bindMap(container) {
    if (container) {
      this.removeMap()
      this.createMap(container)
    }
  }

  removeMap() {
    if (this.map) {
      this.map.off()
      this.map.remove()
      this.map = null
    }
  }

  getTileAttributesFromLatLng = latlng => {
    const { x, y } = this.mapCoordinates.latLngToCartesian(latlng)
    const { wallet, parcels, districts } = this.props
    return this.getTileAttributes(x, y, wallet, parcels, districts)
  }
  // Called by the Parcel Grid on each tile render
  getTileAttributes = (x, y, wallet, parcels, districts) => {
    const parcel = parcels[buildCoordinate(x, y)]
    const district = parcel ? districts[parcel.district_id] : null

    const { backgroundColor, color, label, description } = getParcelAttributes(
      wallet,
      parcel,
      district
    )

    return {
      x,
      y,
      color,
      backgroundColor,
      label,
      description
    }
  }

  // Called by the Parcel Grid on each tile click
  handleTileClick = latlng => {
    const { x, y } = this.mapCoordinates.latLngToCartesian(latlng)
    const { onSelect } = this.props

    onSelect(x, y)
  }

  handleMousedown = latlng => {
    this.dragging = true
    if (this.popup) {
      this.popup.remove()
    }
  }

  handleMouseUp = latlng => {
    this.dragging = false
  }

  handleMouseMove = latlng => {
    if (this.dragging) {
      return
    }
    const { x, y } = this.mapCoordinates.latLngToCartesian(latlng)

    if (
      !this.tileHovered ||
      this.tileHovered.x !== x ||
      this.tileHovered.y !== y
    ) {
      if (this.popup) {
        this.popup.remove()
        this.popup = null
      }
      this.tileHovered = { x, y }
      this.debouncedHandleHover(x, y, latlng)
    }
  }

  handleHover = (x, y, latlng) => {
    const { onHover } = this.props
    onHover(x, y)
    this.addPopup(x, y, latlng)
  }

  // Called by the Parcel Grid on each tile hover
  addPopup = (x, y, latlng) => {
    if (this.dragging) {
      return
    }

    const leafletPopup = L.popup({ direction: 'top', autoPan: false })
    leafletPopup.setLatLng(latlng).addTo(this.map)
    this.popup = leafletPopup

    const { wallet, parcels, districts } = this.props
    this.renderPopup(x, y, wallet, parcels, districts)

    return leafletPopup
  }

  renderPopup = (x, y, wallet, parcels, districts) => {
    if (this.popup) {
      const {
        color,
        label,
        backgroundColor,
        description
      } = this.getTileAttributes(x, y, wallet, parcels, districts)

      const content = renderToDOM(
        <ParcelPopup
          x={x}
          y={y}
          color={color}
          backgroundColor={backgroundColor}
          label={label}
          description={description}
        />
      )

      requestAnimationFrame(() => this.popup && this.popup.setContent(content))
    }
  }

  render() {
    return <div id={MAP_ID} ref={this.bindMap.bind(this)} />
  }
}

function renderToDOM(Component) {
  const div = L.DomUtil.create('div')
  ReactDOM.render(Component, div)
  return div
}
