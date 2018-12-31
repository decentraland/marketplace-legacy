import { server } from 'decentraland-commons'

import { indexedTiles } from '.'
import { Tile } from './Tile.model'

export class TileRouter {
  constructor(app) {
    this.app = app
  }

  mount() {
    this.app.get('/tiles', server.handleRequest(this.getTiles))

    this.app.get('/tiles/new', server.handleRequest(this.getNewTiles))

    this.app.get('/tiles/:address', server.handleRequest(this.getAddressTiles))
  }

  getTiles(req) {
    return indexedTiles.get()
  }

  async getAddressTiles(req) {
    const address = server.extractFromReq(req, 'address').toLowerCase()
    const addressTiles = await Tile.getForOwner(address)
    return indexedTiles.compute(addressTiles)
  }

  async getNewTiles(req) {
    const from = server.extractFromReq(req, 'from')
    const fromDate = new Date(parseInt(from, 10))

    const tiles = await Tile.findFrom(fromDate)
    const response = indexedTiles.compute(tiles)

    try {
      const address = server.extractFromReq(req, 'address').toLowerCase()
      const addressTiles = await Tile.getForOwner(address, fromDate)
      for (const tile of addressTiles) {
        response[tile.id] = indexedTiles.trim(tile)
      }
    } catch (error) {
      // Skip
    }

    return response
  }
}
