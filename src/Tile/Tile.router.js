import { server } from 'decentraland-commons'

import { Tile } from './Tile.model'
import { tilesObject } from './tilesObject'
import { TYPES } from '../shared/map'

export class TileRouter {
  constructor(app) {
    this.app = app
  }

  mount() {
    this.app.get('/tiles', server.handleRequest(this.getTiles))
  }

  getTiles = async req => {
    let tiles = {}

    console.time('getTiles')
    try {
      const address = server.extractFromReq(req, 'address').toLowerCase()
      tiles = await tilesObject.getForOwner(address)
    } catch (error) {
      tiles = await tilesObject.get()
    }
    console.timeEnd('getTiles')
    return tiles
  }
}
