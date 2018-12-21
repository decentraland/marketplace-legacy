import { server } from 'decentraland-commons'
import { createCanvas } from 'canvas'

import { Tile } from '../Tile'
import { Asset, Parcel, Estate, EstateService } from '../Asset'
import { MapReqQueryParams } from '../ReqQueryParams'
import { sanitizeParcels } from '../sanitize'
import { calculateMapProps } from '../shared/estate'
import * as coordinates from '../shared/coordinates'
import { Viewport } from '../shared/map'
import { Map as MapRenderer } from '../shared/map/render'

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
    const { width, height, size, skipPublications } = this.sanitize(req)
    const id = server.extractFromReq(req, 'id')
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

  sanitize(req) {
    return new MapReqQueryParams(req).sanitize()
  }
}
