import { Tile } from '../Tile'
import { db } from '../database'
import { TileType, TYPES, shortenOwner } from '../shared/map'
import { isExpired } from '../shared/utils'

const DB_CHANNEL = 'tile_updated'

export class IndexedTiles {
  constructor() {
    this.cache = {}
    this.cacheKeys = []
    this.isListening = false
  }

  listen = async () => {
    const tiles = await Tile.find()

    this.cache = this.compute(tiles)
    this.cacheKeys = Object.keys(this.cache)

    db.on(DB_CHANNEL, msg => {
      const tile = JSON.parse(msg.payload)
      this.cache[tile.id] = this.trim(tile)
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
    return this.compute(tiles)
  }

  async getForOwner(address) {
    let map = {}

    if (this.isListening) {
      for (const id of this.cacheKeys) {
        map[id] = this.cache[id]
      }
    } else {
      const allTiles = await Tile.find()
      map = this.compute(allTiles)
    }

    const addressTiles = await Tile.getForOwner(address)
    for (const tile of addressTiles) {
      map[tile.id] = this.trim(tile)
    }

    return map
  }

  compute(tiles) {
    const map = {}

    for (const tile of tiles) {
      map[tile.id] = this.trim(tile)
    }

    return map
  }

  trim(tile) {
    const newTile = {
      x: tile.x,
      y: tile.y,
      type: tile.type
    }
    if (tile.price) newTile.price = tile.price
    if (tile.name) newTile.name = tile.name
    if (tile.estate_id) newTile.estate_id = tile.estate_id
    if (tile.is_connected_left) newTile.left = 1
    if (tile.is_connected_top) newTile.top = 1
    if (tile.is_connected_topleft) newTile.topLeft = 1
    if (tile.owner && [TYPES.taken, TYPES.onSale].includes(tile.type)) {
      newTile.owner = shortenOwner(tile.owner)
    }
    if (tile.expires_at && isExpired(tile.expires_at)) {
      newTile.price = null
      newTile.type = TileType.getExpired(tile.type)
    }

    return newTile
  }
}
