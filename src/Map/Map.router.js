import { server } from 'decentraland-commons'
import { createCanvas } from 'canvas'

import { Tile } from '../Tile'
import { Asset, Parcel, Estate, EstateService } from '../Asset'
import { sanitizeParcels } from '../sanitize'
import { unsafeParseInt } from '../lib'
import { db } from '../database'
import { calculateMapProps } from '../shared/estate'
import * as coordinates from '../shared/coordinates'
import { Viewport, Bounds, TYPES } from '../shared/map'
import { Map as MapRenderer } from '../shared/map/render'

const { minX, maxX, minY, maxY } = Bounds.getBounds()

export class MapRouter {
  constructor(app) {
    this.app = app

    this.cache = {}
  }

  mount() {
    this.app.get('/map.png', this.handleRequest(this.getMapPNG))
    this.app.get(
      '/parcels/:x/:y/map.png',
      this.handleRequest(this.getParcelPNG)
    )
    this.app.get('/estates/:id/map.png', this.handleRequest(this.getEstatePNG))
    this.app.get('/map', server.handleRequest(this.getMap))
    this.app.get('/tiles', server.handleRequest(this.getTiles))

    db.on('notification', async msg => {
      if (msg.name === 'notification' && msg.channel === 'tile_updated') {
        const tile = JSON.parse(msg.payload)
        this.cache[tile.id] = this.toMapTile(tile)
      }
    })

    db.query('LISTEN tile_updated')

    Tile.find().then(tiles => {
      for (const tile of tiles) {
        this.cache[tile.id] = this.toMapTile(tile)
      }
    })
  }

  handleRequest(callback) {
    return async (req, res) => {
      try {
        await callback.call(this, req, res)
      } catch (error) {
        res.status(500)
        res.send(error.message)
      }
    }
  }

  getTiles = async req => {
    let tiles = []

    console.time('getTiles')
    try {
      const address = server.extractFromReq(req, 'address').toLowerCase()
      tiles = await Tile.getFromAddressPerspective(address)
    } catch (error) {
      console.log(error)
    }
    console.timeEnd('getTiles')

    console.time('iterateTiles')
    const map = this.cache

    for (const tile of tiles) {
      map[tile.id] = this.toMapTile(tile)
    }
    console.timeEnd('iterateTiles')

    return map['-43,-127']
  }

  async getMapPNG(req, res) {
    return this.sendPNG(res, this.sanitize(req))
  }

  async getParcelPNG(req, res) {
    const { x, y, width, height, size, skipPublications } = this.sanitize(req)
    const center = { x, y }
    const mapOptions = {
      width,
      height,
      size,
      center,
      selected: [center],
      skipPublications
    }
    return this.sendPNG(res, mapOptions)
  }

  async getEstatePNG(req, res) {
    const { id, width, height, size, skipPublications } = this.sanitizeEstate(
      req
    )
    const estate = await Estate.findByTokenId(id)
    if (!estate) {
      throw new Error(`The estate with token id "${id}" doesn't exist.`)
    }

    const { parcels } = estate.data
    const { center, zoom, pan } = calculateMapProps(parcels, size)
    const mapOptions = {
      width,
      height,
      size,
      center,
      zoom,
      pan,
      selected: parcels,
      skipPublications
    }
    return this.sendPNG(res, mapOptions)
  }

  async getMap(req) {
    let nw
    let se
    try {
      nw = server.extractFromReq(req, 'nw')
      se = server.extractFromReq(req, 'se')
    } catch (_) {
      throw new Error('Both "nw" and "se" are required query params')
    }

    const parcelsRange = await Parcel.inRange(nw, se)
    const parcels = sanitizeParcels(parcelsRange)
    const estates = await new EstateService().getByParcels(parcels)

    const assets = { parcels, estates }
    const total = parcels.length + estates.length
    return { assets, total }
  }

  async sendPNG(
    res,
    { width, height, size, center, selected, skipPublications, zoom, pan }
  ) {
    const { nw, se } = Viewport.getDimensions({
      width,
      height,
      center,
      size,
      zoom,
      pan,
      padding: 1
    })

    try {
      const stream = await this.getStream({
        width,
        height,
        size,
        nw,
        se,
        center,
        selected,
        skipPublications
      })
      res.type('png')
      stream.pipe(res)
    } catch (error) {
      res.status(500)
      res.send(error.message)
    }
  }

  async getStream({
    width,
    height,
    size,
    nw,
    se,
    center,
    selected,
    skipPublications
  }) {
    const tiles = await Tile.inRangePNG(nw, se)

    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')

    new MapRenderer(ctx, {
      width,
      height,
      size
    }).drawFromTiles({
      center,
      tiles,
      selected,
      skipPublications
    })
    return canvas.pngStream()
  }

  toMapTile(tile) {
    const mapTile = {
      x: tile.x,
      y: tile.y,
      type: tile.type
    }
    if (tile.owner && [TYPES.taken, TYPES.onSale].includes(tile.type)) {
      mapTile.owner = tile.owner.slice(0, 6)
    }
    if (tile.price) mapTile.price = tile.price
    if (tile.name) mapTile.name = tile.name
    if (tile.estate_id) mapTile.estate_id = tile.estate_id
    if (tile.is_connected_left) mapTile.left = 1
    if (tile.is_connected_top) mapTile.top = 1
    if (tile.is_connected_topleft) mapTile.topLeft = 1

    return mapTile
  }

  sanitizeEstate(req) {
    return {
      id: server.extractFromReq(req, 'id'),
      ...this.sanitize(req)
    }
  }

  sanitize(req) {
    return {
      x: this.getInteger(req, 'x', minX, maxX, 0),
      y: this.getInteger(req, 'y', minY, maxY, 0),
      width: this.getInteger(req, 'width', 32, 1024, 500),
      height: this.getInteger(req, 'height', 32, 1024, 500),
      size: this.getInteger(req, 'size', 1, 40, 10),
      center: this.getCoords(req, 'center', { x: 0, y: 0 }),
      selected: this.getCoordsArray(req, 'selected', []),
      skipPublications: !this.getBoolean(req, 'publications', false) // Mind the negation here
    }
  }

  getInteger(req, name, min, max, defaultValue) {
    let param, value
    try {
      param = server.extractFromReq(req, name)
    } catch (error) {
      return defaultValue
    }

    try {
      value = unsafeParseInt(param)
    } catch (e) {
      throw new Error(
        `Invalid param "${name}" should be a integer but got "${param}"`
      )
    }
    return value > max ? max : value < min ? min : value
  }

  getCoords(req, name, defaultValue) {
    let param
    try {
      param = server.extractFromReq(req, name)
    } catch (error) {
      return defaultValue
    }

    let coords
    try {
      const [x, y] = coordinates.splitCoordinate(param)
      coords = { x, y }
    } catch (error) {
      throw new Error(
        `Invalid param "${name}" should be a coordinate "x,y" but got "${param}".`
      )
    }
    return coords
  }

  getCoordsArray(req, name, defaultValue) {
    let param
    try {
      param = server.extractFromReq(req, name)
    } catch (error) {
      return defaultValue
    }

    let coordsArray = []
    try {
      coordsArray = param.split(';').map(pair => {
        const [x, y] = coordinates.splitCoordinate(pair)
        return { x, y }
      })
    } catch (error) {
      throw new Error(
        `Invalid param "${name}" should be a list of coordinates "x1,y1;x2,y2" but got "${param}".`
      )
    }
    return coordsArray
  }

  getBoolean(req, name, defaultValue) {
    let param
    try {
      param = server.extractFromReq(req, name)
    } catch (error) {
      return defaultValue
    }
    const value = param === 'true' ? true : param === 'false' ? false : null
    if (value === null) {
      throw new Error(
        `Invalid param "${name}" should be a boolean but got "${param}".`
      )
    }
    return value
  }
}
