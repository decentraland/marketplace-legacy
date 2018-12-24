import { server } from 'decentraland-commons'

import { Tile } from './Tile.model'
import { tilesObject } from './tilesObject'

export class TileRouter {
  constructor(app) {
    this.app = app
  }

  mount() {
    this.app.get('/tiles', server.handleRequest(this.getTiles))

    this.app.get('/tiles/:address', server.handleRequest(this.getAddressTiles))
  }

  getTiles = async req => {
    try {
      const address = server.extractFromReq(req, 'address').toLowerCase()
      return tilesObject.getForOwner(address)
    } catch (error) {
      return tilesObject.get()
    }
  }

  async getAddressTiles(req) {
    const address = server.extractFromReq(req, 'address').toLowerCase()
    const addressTiles = await Tile.getForOwner(address)
    return tilesObject.compute(addressTiles)
  }
}
