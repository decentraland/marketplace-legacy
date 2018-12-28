import { env } from 'decentraland-commons'

import { db } from '../database'
import { IndexedTiles } from './IndexedTiles'

const indexedTiles = new IndexedTiles()

if (env.get('CACHE_TILES', false)) {
  db.onConnect(tiles.listen)
}

export { indexedTiles }
export { Tile } from './Tile.model'
export { TileRouter } from './Tile.router'
