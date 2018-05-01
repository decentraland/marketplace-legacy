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
import { getParcelAttributes, isOnSale } from 'lib/parcelUtils'

import './ParcelsMap.css'

const MAP_ID = 'map'

L.Icon.Default.imagePath = 'https://cdnjs.com/ajax/libs/leaflet/1.0.3/images/'

// I'm not proud of the following piece of code but
// it will keep Rollbar from filling our inboxes:
const original_onPanTransitionEnd = L.Map.prototype._onPanTransitionEnd
L.Map.prototype._onPanTransitionEnd = function() {
  if (!this._mapPane) return
  return original_onPanTransitionEnd.apply(this, arguments)
}

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
    marker: PropTypes.string,

    minZoom: PropTypes.number.isRequired,
    maxZoom: PropTypes.number.isRequired,
    baseZoom: PropTypes.number.isRequired,
    zoom: PropTypes.number.isRequired,
    tileSize: PropTypes.number.isRequired,

    onMoveEnd: PropTypes.func.isRequired,
    onZoomEnd: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.debouncedHandleHover = debounce(this.handleHover, 400)
    this.debouncedRedrawMap = debounce(this.redrawMap, 400)
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
  }

  componentWillUnmount() {
    this.removeMap()
  }

  componentWillReceiveProps(nextProps) {
    const shouldUpdateCenter =
      !this.panInProgress &&
      (this.props.x !== nextProps.x || this.props.y !== nextProps.y)

    const shouldRedraw = !!this.map

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
  }

  shouldPopupUpdate = nextProps => {
    if (this.popup && this.tileHovered) {
      // Check if the land or wallet data has changed in order to update the popup
      const { x, y } = this.tileHovered
      const coords = buildCoordinate(x, y)
      const nextParcel = nextProps.parcels[coords]
      const currentParcel = this.props.parcels[coords]
      const nextParcelData = nextParcel && nextParcel.data
      const currentParcelData = currentParcel && currentParcel.data

      return (
        !isEqual(nextParcelData, currentParcelData) ||
        this.props.wallet !== nextProps.wallet
      )
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.shouldPopupUpdate(nextProps)) {
      const { x, y } = this.tileHovered
      this.renderPopup(x, y, nextProps)
    }
    return (
      this.props.tileSize !== nextProps.tileSize ||
      this.props.marker !== nextProps.marker
    )
  }

  createMap(container) {
    const {
      x,
      y,
      tileSize,
      minZoom,
      maxZoom,
      bounds,
      zoom,
      marker,
      parcels
    } = this.props

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
      tileSize,
      marker,
      parcels
    })

    this.map.zoomControl.setPosition('bottomright')
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
    this.handleMoveEnd()
  }

  handleMapZoomEnd = () => {
    this.props.onZoomEnd(this.map.getZoom())
    this.handleMoveEnd()
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
    return this.getTileAttributes(x, y)
  }
  // Called by the Parcel Grid on each tile render
  getTileAttributes = (x, y, { wallet, parcels, districts } = this.props) => {
    const id = buildCoordinate(x, y)
    const parcel = parcels[id]

    const { backgroundColor, color, label, description } = getParcelAttributes(
      id,
      x,
      y,
      wallet,
      parcels,
      districts
    )

    const publication = isOnSale(parcel) ? parcel.publication : null

    return {
      id,
      x,
      y,
      color,
      backgroundColor,
      label,
      description,
      publication,
      connectedLeft: parcel && parcel.connectedLeft,
      connectedTop: parcel && parcel.connectedTop,
      connectedTopLeft: parcel && parcel.connectedTopLeft
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
    this.removePopup()
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
      this.removePopup()
      this.tileHovered = { x, y }
      this.debouncedHandleHover(x, y, latlng)
    }
  }

  handleHover = (x, y, latlng) => {
    this.addPopup(x, y, latlng)
  }

  // Called by the Parcel Grid on each tile hover
  addPopup = (x, y, latlng) => {
    if (this.dragging || !this.map) {
      return
    }
    this.removePopup()
    const leafletPopup = L.popup({ direction: 'top', autoPan: false })
    leafletPopup.setLatLng(latlng)
    // This check is not superflous -- setLatLng might move the map and triger a rebind
    if (!this.map) {
      return
    }
    leafletPopup.addTo(this.map)
    this.popup = leafletPopup
    this.renderPopup(x, y)

    return leafletPopup
  }

  removePopup() {
    if (this.popup) {
      this.popup.remove()
      this.popup = null
    }
  }

  renderPopup = (x, y, props = this.props) => {
    if (this.popup) {
      const {
        color,
        label,
        backgroundColor,
        description,
        publication
      } = this.getTileAttributes(x, y, props)

      if (this.popupContent) {
        ReactDOM.unmountComponentAtNode(this.popupContent)
        this.popupContent = null
      }

      this.popupContent = renderToDOM(
        <ParcelPopup
          x={x}
          y={y}
          color={color}
          backgroundColor={backgroundColor}
          label={label}
          description={description}
          publication={publication}
        />
      )

      requestAnimationFrame(
        () => this.popup && this.popup.setContent(this.popupContent)
      )
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
