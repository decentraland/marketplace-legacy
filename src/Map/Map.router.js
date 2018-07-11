import { server, utils } from 'decentraland-commons'
import { createCanvas } from 'canvas'

import {
  toParcelObject,
  splitCoordinate,
  getParcelPublications
} from '../shared/parcel'
import { toEstateObject, calculateZoomAndCenter } from '../shared/estate'
import { Viewport, Bounds } from '../shared/map'
import { Map as MapRenderer } from '../shared/map/render'
import { toPublicationObject } from '../shared/publication'
import { Parcel, coordinates } from '../Parcel'
import { Estate, EstateService } from '../Estate'
import { blacklist } from '../lib'

const { minX, maxX, minY, maxY } = Bounds.getBounds()
const MAX_AREA = 15000

export class MapRouter {
  constructor(app) {
    this.app = app
  }

  mount() {
    this.app.get('/map.png', this.handleRequest(this.getMapPNG))
    this.app.get(
      '/parcels/:x/:y/map.png',
      this.handleRequest(this.getParcelPNG)
    )
    this.app.get('/estates/:id/map.png', this.handleRequest(this.getEstatePNG))
    this.app.get('/map', server.handleRequest(this.getMap))
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
    const { x, y, width, height, size, showPublications } = this.sanitize(req)
    const center = { x, y }
    const mapOptions = {
      width,
      height,
      size,
      center,
      selected: [center],
      showPublications
    }
    return this.sendPNG(res, mapOptions)
  }

  async getEstatePNG(req, res) {
    const { id, width, height, size, showPublications } = this.sanitizeEstate(
      req
    )
    const estate = await Estate.findById(id)

    if (!estate) {
      throw new Error(`The estate with id "${id}" doesn't exist.`)
    }

    const { parcels } = estate.data
    const { center } = calculateZoomAndCenter(parcels)
    const mapOptions = {
      width,
      height,
      size,
      center,
      selected: parcels,
      showPublications
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
    const parcels = utils.mapOmit(parcelsRange, blacklist.parcel)
    const estates = await EstateService.getByParcels(parcels)

    const assets = { parcels, estates }
    const total = parcels.length + estates.length
    return { assets, total }
  }

  async sendPNG(
    res,
    { width, height, size, center, selected, showPublications }
  ) {
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
        center,
        selected,
        showPublications
      })
      res.type('png')
      stream.pipe(res)
    } catch (error) {
      res.status(500)
      res.send(error.message)
    }
  }

  async getAssetsAndPublications(nw, se) {
    const parcelRange = utils.mapOmit(
      await Parcel.inRange(nw, se),
      blacklist.parcel
    )
    const parcels = toParcelObject(parcelRange)
    const estatesRange = await EstateService.getByParcels(parcelRange)
    const estates = toEstateObject(estatesRange)
    const publications = toPublicationObject(getParcelPublications(parcelRange))
    return [parcels, estates, publications]
  }

  async getStream({
    width,
    height,
    size,
    nw,
    se,
    center,
    selected,
    showPublications
  }) {
    const [
      parcels,
      estates,
      publications
    ] = await this.getAssetsAndPublications(nw, se)
    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')
    MapRenderer.draw({
      ctx,
      width,
      height,
      size,
      nw,
      se,
      center,
      parcels,
      estates,
      publications: showPublications ? publications : {},
      selected
    })
    return canvas.pngStream()
  }

  sanitizeEstate(req) {
    return {
      id: server.extractFromReq(req, 'id'),
      ...this.sanitize(req)
    }
  }

  sanitize(req) {
    return {
      x: this.getNumber(req, 'x', minX, maxX, 0),
      y: this.getNumber(req, 'y', minY, maxY, 0),
      width: this.getNumber(req, 'width', 32, 1024, 500),
      height: this.getNumber(req, 'height', 32, 1024, 500),
      size: this.getNumber(req, 'size', 5, 40, 10),
      center: this.getCoords(req, 'center', { x: 0, y: 0 }),
      selected: this.getCoordsArray(req, 'selected', []),
      showPublications: this.getBoolean(req, 'publications', false)
    }
  }

  getNumber(req, name, min, max, defaultValue) {
    let param
    try {
      param = server.extractFromReq(req, name)
    } catch (error) {
      return defaultValue
    }

    const value = parseInt(Number(param), 10)
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
      if (!coordinates.isValid(param)) {
        throw new Error('Invalid coords')
      }
      const [x, y] = splitCoordinate(param)
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
        const [x, y] = splitCoordinate(pair)
        if (!coordinates.isValid(pair)) {
          throw new Error('Invalid coords')
        }
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
