import L from 'leaflet'
import { requestAnimationFrame, cancelAnimationFrame } from './utils'
import { marker } from './marker'

export const LeafletParcelGrid = L.Layer.extend({
  include: L.Mixin.Events,
  options: {
    getTileAttributes: () => {},
    onTileClick: () => {},
    onMouseDown: () => {},
    onMouseUp: () => {},
    onMouseMove: () => {},
    tileSize: 64,
    marker: null
  },

  initialize(options = {}) {
    L.Util.setOptions(this, options)
    this.canvas = this.createCanvas()
    this.currentAnimationFrame = -1
    this.requestAnimationFrame = requestAnimationFrame
    this.cancelAnimationFrame = cancelAnimationFrame
  },

  createCanvas: function() {
    let canvas = document.createElement('canvas')
    canvas.style.position = 'absolute'
    canvas.style.top = 0
    canvas.style.left = 0
    canvas.style.pointerEvents = 'none'
    canvas.style.zIndex = 0
    canvas.setAttribute('class', 'leaflet-tile-container leaflet-zoom-animated')
    return canvas
  },

  onAdd(map) {
    this.map = map
    this.setupGrid(map.getBounds())

    // add container with the canvas to the tile pane
    // the container is moved in the oposite direction of the
    // map pane to keep the canvas always in (0, 0)
    const pane = map._panes.markerPane
    const container = L.DomUtil.create('div', 'leaflet-layer')
    container.appendChild(this.canvas)
    pane.appendChild(container)

    this.container = container

    // hack: listen to predrag event launched by dragging to
    // set container in position (0, 0) in screen coordinates
    if (map.dragging.enabled()) {
      map.dragging._draggable.on(
        'predrag',
        function() {
          const d = map.dragging._draggable
          L.DomUtil.setPosition(this.canvas, {
            x: -d._newPos.x,
            y: -d._newPos.y
          })
        },
        this
      )
    }

    map.on('moveend', this.moveHandler, this)
    map.on('zoomend', this.zoomHandler, this)
    map.on('resize', this.resizeHandler, this)
    map.on('mousedown', this.mousedownHandler, this)
    map.on('mouseup', this.mouseupHandler, this)
    map.on('mousemove', this.mousemoveHandler, this)
    map.on('click', this.clickHandler, this)
    map.on('viewreset', this.reset, this)
    map.on('resize', this.reset, this)
    map.on('move', this.redraw, this)

    this.reset()
  },

  onRemove(map) {
    this.container.parentNode.removeChild(this.container)

    map.off('moveend', this.moveHandler, this)
    map.off('zoomend', this.zoomHandler, this)
    map.off('resize', this.resizeHandler, this)
    map.off('mousedown', this.mousedownHandler, this)
    map.off('mouseup', this.mouseupHandler, this)
    map.off('mousemove', this.mousemoveHandler, this)
    map.off('click', this.clickHandler, this)
    map.off('viewreset', this.reset, this)
    map.off('resize', this.reset, this)
    map.off('move', this.redraw, this)
  },

  reset: function() {
    const size = this.map.getSize()
    this.canvas.width = size.x
    this.canvas.height = size.y
    this.redraw()
  },

  render: function() {
    if (this.currentAnimationFrame >= 0) {
      this.cancelAnimationFrame.call(window, this.currentAnimationFrame)
    }
    this.currentAnimationFrame = this.requestAnimationFrame.call(window, () => {
      try {
        this.renderTiles(this.map.getBounds())
      } catch (e) {
        // sometimes this line is reached because at the time the requestAnimationFrame callback
        // get called the map is uninitialized ¯\_(ツ)_/¯
      }
    })
  },

  redraw: function(direct) {
    const pos = L.DomUtil.getPosition(this.map.getPanes().mapPane)
    if (pos) {
      L.DomUtil.setPosition(this.canvas, { x: -pos.x, y: -pos.y })
    }
    if (direct) {
      this.renderTiles(this.map.getBounds())
    } else {
      this.render()
    }
  },

  moveHandler(event) {
    this.renderTiles(event.target.getBounds())
  },

  zoomHandler(event) {
    this.renderTiles(event.target.getBounds())
  },

  resizeHandler() {
    this.setupSize()
  },

  mousemoveHandler(e) {
    this.options.onMouseMove(e.latlng)
  },

  mousedownHandler(e) {
    this.options.onMouseDown(e.latlng)
  },

  mouseupHandler(e) {
    this.options.onMouseUp(e.latlng)
  },

  clickHandler(e) {
    this.options.onTileClick(e.latlng)
  },

  setupGrid(bounds) {
    this.origin = this.map.project(bounds.getNorthWest())
    this.tileSize = this.options.tileSize
    this.setupSize()
    this.renderTiles(bounds)
  },

  setupSize() {
    this.rows = Math.ceil(this.map.getSize().x / this.tileSize) + 1
    this.cols = Math.ceil(this.map.getSize().y / this.tileSize) + 1
  },

  renderTiles(bounds) {
    const tiles = this.getCellsInBounds(bounds)

    // Clear canvas
    const ctx = this.canvas.getContext('2d')
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    let markerCenter = null
    const parcelsOnSale = []
    for (let index = 0; index < tiles.length; index++) {
      const tile = tiles[index]
      const {
        id,
        backgroundColor,
        publication
      } = this.options.getTileAttributes(tile.bounds.getNorthWest())
      const point = this.map.latLngToContainerPoint(tile.center)
      this.renderTile(point.x, point.y, backgroundColor)
      if (this.options.marker === id) {
        markerCenter = point
      }
      if (publication) {
        parcelsOnSale.push(point)
      }
    }
    parcelsOnSale.forEach(parcelOnSale => {
      this.renderMarker({
        ctx,
        center: parcelOnSale,
        fillPrimary: '#5d5890',
        fillSecondary: '#3e396b',
        stroke: '#3e396b'
      })
    })
    if (markerCenter) {
      this.renderMarker({
        ctx,
        center: markerCenter
      })
    }
  },

  renderTile(x, y, color) {
    // Render tile
    const ctx = this.canvas.getContext('2d')
    const padding = 1

    ctx.fillStyle = color
    ctx.fillRect(
      x - this.tileSize,
      y - this.tileSize,
      this.tileSize - padding,
      this.tileSize - padding
    )
  },

  renderMarker({ ctx, center, fillPrimary, fillSecondary, stroke, scale }) {
    marker.draw({
      ctx,
      x: center.x - this.tileSize / 2,
      y: center.y - this.tileSize / 2,
      fillPrimary,
      fillSecondary,
      stroke,
      scale
    })
  },

  getCellPoint(row, col) {
    const x = this.origin.x + row * this.tileSize
    const y = this.origin.y + col * this.tileSize
    return new L.Point(x, y)
  },

  getCellExtent(row, col) {
    const swPoint = this.getCellPoint(row, col)
    const nePoint = this.getCellPoint(row - 1, col - 1)
    const sw = this.map.unproject(swPoint)
    const ne = this.map.unproject(nePoint)
    return new L.LatLngBounds(ne, sw)
  },

  getCellsInBounds(bounds) {
    const offset = this.getBoundsOffset(bounds)
    const tiles = []

    if (!this._tiles) {
      this._tiles = {}
    }

    for (let i = 0; i <= this.rows; i++) {
      for (let j = 0; j <= this.cols; j++) {
        const row = i - offset.rows
        const col = j - offset.cols
        const id = row + ':' + col

        if (!this._tiles[id]) {
          const tileBounds = this.getCellExtent(row, col)
          const tileCenter = tileBounds.getCenter()
          this._tiles[id] = {
            id,
            bounds: tileBounds,
            center: tileCenter
          }
        }

        tiles.push(this._tiles[id])
      }
    }

    return tiles
  },

  getBoundsOffset(bounds) {
    const offset = this.map.project(bounds.getNorthWest())
    const offsetX = this.origin.x - offset.x
    const offsetY = this.origin.y - offset.y

    return {
      rows: Math.round(offsetX / this.tileSize),
      cols: Math.round(offsetY / this.tileSize)
    }
  }
})
