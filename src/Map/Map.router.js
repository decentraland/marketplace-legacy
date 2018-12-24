import { server } from 'decentraland-commons'
import { createCanvas } from 'canvas'

import { tilesObject } from '../Tile'
import { Parcel, Estate, EstateService } from '../Asset'
import { MapReqQueryParams } from '../ReqQueryParams'
import { sanitizeParcels } from '../sanitize'
import { calculateMapProps } from '../shared/estate'
import { Viewport } from '../shared/map'
import { Map as MapRenderer } from '../shared/map/render'

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
    const { x, y, ...mapOptions } = this.sanitize(req)
    const center = { x, y }
    mapOptions.center = center
    mapOptions.selected = [center]
    return this.sendPNG(res, mapOptions)
  }

  async getEstatePNG(req, res) {
    const id = server.extractFromReq(req, 'id')
    const estate = await Estate.findByTokenId(id)
    if (!estate) {
      throw new Error(`The estate with token id "${id}" doesn't exist.`)
    }

    const { size, ...mapOptions } = this.sanitize(req)
    const { parcels } = estate.data
    const { center, zoom, pan } = calculateMapProps(parcels, size)

    mapOptions.center = center
    mapOptions.zoom = zoom
    mapOptions.pan = pan
    mapOptions.selected = parcels

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

  async sendPNG(res, mapOptions) {
    const { width, height, size, center, zoom, pan } = mapOptions

    const { nw, se } = Viewport.getDimensions({
      width,
      height,
      size,
      center,
      zoom,
      pan,
      padding: 1
    })

    try {
      const stream = await this.getStream({ ...mapOptions, nw, se })
      res.type('png')
      stream.pipe(res)
    } catch (error) {
      res.status(500)
      res.send(error.message)
    }
  }

  async getStream({
    nw,
    se,
    width,
    height,
    size,
    center,
    selected,
    address,
    skipPublications
  }) {
    const tiles = address
      ? await tilesObject.getForOwner(address)
      : await tilesObject.get()

    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')

    new MapRenderer(ctx, {
      width,
      height,
      size
    }).draw({
      nw,
      se,
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
