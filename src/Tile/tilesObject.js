import { env } from 'decentraland-commons'

import { db } from '../database'
import { Tile } from '../Tile'
import { TYPES } from '../shared/map'

const DB_CHANNEL = 'tile_updated'

class TilesObject {
  constructor() {
    this.cache = {}
    this.cacheKeys = []
    this.isListening = false
  }

  listen = async () => {
    const tiles = await Tile.find()

    for (const tile of tiles) {
      this.cache[tile.id] = this.toMapTile(tile)
    }
    this.cacheKeys = Object.keys(this.cache)

    db.on(DB_CHANNEL, msg => {
      const tile = JSON.parse(msg.payload)
      this.cache[tile.id] = this.toMapTile(tile)
    })

    this.isListening = true
  }

  stopListening() {
    db.off(DB_CHANNEL)
    this.isListening = false
    this.cache = {}
    this.cacheKeys = []
  }

  async get() {
    if (this.isListening) {
      return this.cache
    }

    const tiles = await Tile.find()
    const map = {}

    for (const tile of tiles) {
      map[tile.id] = this.toMapTile(tile)
    }

    return map
  }

  async getForOwner(address) {
    const map = {}

    if (this.isListening) {
      for (const id of this.cacheKeys) {
        map[id] = this.cache[id]
      }
    } else {
      const allTiles = await Tile.find()
      for (const tile of allTiles) {
        map[tile.id] = this.toMapTile(tile)
      }
    }

    const addressTiles = await Tile.getForOwner(address)
    for (const tile of addressTiles) {
      map[tile.id] = this.toMapTile(tile)
    }

    return map
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
}

const tilesObject = new TilesObject()

// TODO: default should be false
if (env.get('CACHE_TILES', true)) {
  db.onConnect(tilesObject.listen)
}

export { tilesObject }
