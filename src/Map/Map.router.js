import { server, utils } from 'decentraland-commons'

const { createCanvas } = require('canvas')

import { Map as MapRenderer } from '../shared/map/render'

import { Parcel } from '../Parcel'
import { blacklist } from '../lib'
import { Viewport } from '../shared/map'
import { toParcelObject, splitCoordinate } from '../../shared/parcel'

import { Bounds } from '../shared/map'

const { minX, maxX, minY, maxY } = Bounds.getBounds()

const MAX_AREA = 15000

const areCoordsValid = coords => !isNaN(coords.x) && !isNaN(coords.y)

export class MapRouter {
  constructor(app) {
    this.app = app
  }

  mount() {
    this.app.get('/api/map.png', this.handleRequest(this.getMapPNG))
    this.app.get('/api/:x/:y/map.png', this.handleRequest(this.getParcelPNG))
    // TODO: add an endpoint for Estates someday 🏌🏼‍
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

  async getMapPNG(req, res) {
    return this.sendPNG(res, this.sanitize(req))
  }

  async getParcelPNG(req, res) {
    const { x, y, width, height, size } = this.sanitize(req)
    const center = { x, y }
    const mapOptions = {
      width,
      height,
      size,
      center,
      selected: [center]
    }
    return this.sendPNG(res, mapOptions)
  }

  async sendPNG(res, { width, height, size, center, selected }) {
    const { nw, se, area } = Viewport.getDimensions({
      width,
      height,
      center,
      size,
      padding: 1
    })
    if (area > MAX_AREA) {
      res.status(400)
      res.send(
        `Too many parcels. You are trying to render ${area} parcels and the maximum allowed is ${MAX_AREA}.`
      )
      return
    }
    try {
      const stream = await this.getStream({
        width,
        height,
        size,
        nw,
        se,
        selected
      })
      res.type('png')
      stream.pipe(res)
    } catch (error) {
      res.status(500)
      res.send(error.message)
    }
  }

  async getParcels(nw, se) {
    let parcels = await Parcel.inRange(nw, se)
    parcels = utils.mapOmit(parcels, blacklist.parcel)
    parcels = toParcelObject(parcels)
    return parcels
  }

  async getStream({ width, height, size, nw, se, selected }) {
    const parcels = await this.getParcels(nw, se)
    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')
    MapRenderer.draw({
      ctx,
      width,
      height,
      size,
      nw,
      se,
      parcels,
      selected
    })
    return canvas.pngStream()
  }

  sanitize(req) {
    return {
      x: this.getNumber(req, 'x', minX, maxX, 0),
      y: this.getNumber(req, 'y', minY, maxY, 0),
      width: this.getNumber(req, 'width', 32, 1024, 500),
      height: this.getNumber(req, 'height', 32, 1024, 500),
      size: this.getNumber(req, 'size', 5, 40, 10),
      center: this.getCoords(req, 'center', { x: 0, y: 0 }),
      selected: this.getCoordsArray(req, 'selected', [])
    }
  }

  getNumber(req, name, min, max, defaultValue) {
    let param
    try {
      param = server.extractFromReq(req, name)
    } catch (error) {
      return defaultValue
    }
    const value = parseInt(param, 10)
    if (isNaN(value)) {
      throw new Error(
        `Invalid param "${name}" should be a number but got "${param}".`
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
      const split = splitCoordinate(param)
      const [x, y] = split.map(coord => parseInt(coord, 10))
      coords = { x, y }
      if (!areCoordsValid(coords)) {
        throw new Error('Invalid coords')
      }
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
      coordsArray = param
        .split(';')
        .map(pair => splitCoordinate(pair))
        .map(pair => pair.map(coord => parseInt(coord, 10)))
        .map(([x, y]) => ({ x, y }))
      if (coordsArray.some(coords => !areCoordsValid(coords))) {
        throw new Error('Invalid coords')
      }
    } catch (error) {
      throw new Error(
        `Invalid param "${name}" should be a list of coordinates "x1,y1;x2,y2" but got "${param}".`
      )
    }
    return coordsArray
  }
}
