import { env } from 'decentraland-commons'

import { db } from '../database'
import { Tile } from '../Tile'
import { TYPES } from '../shared/map'

const DB_CHANNEL = 'tile_updated'

class TilesObject {
  constructor() {
    this.cache = {}
    this.isListening = false

    // TODO: default should be false
    if (env.get('CACHE_TILES', false)) {
      db.onConnect(this.listen)
    }
  }

  listen = async () => {
    const addTileToObject = this.addTileToObject.bind(this, this.cache)
    const tiles = await Tile.find()

    tiles.forEach(addTileToObject)

    db.on(DB_CHANNEL, msg => addTileToObject(JSON.parse(msg.payload)))

    this.isListening = true
  }

  stopListening() {
    db.off(DB_CHANNEL)
    this.isListening = false
    this.cache = {}
  }

  async get() {
    if (this.isListening) {
      return this.cache
    }

    const tiles = await Tile.find()
    const map = {}

    tiles.forEach(this.addTileToObject.bind(this, map))

    return map
  }

  async getForOwner(address) {
    const map = {}
    const addTileToObject = this.addTileToObject.bind(this, map)

    if (this.isListening) {
      Object.assign(map, this.cache)
    } else {
      const allTiles = await Tile.find()
      allTiles.forEach(addTileToObject)
    }

    const addressTiles = await Tile.getForOwner(address)
    addressTiles.forEach(addTileToObject)

    return map
  }

  addTileToObject(obj, tile) {
    obj[tile.id] = this.toMapTile(tile)
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

export const tilesObject = new TilesObject()
