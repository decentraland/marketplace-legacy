import { Model } from 'decentraland-commons'

import { coordinates } from './coordinates'
import { Publication } from '../Publication'

export class Parcel extends Model {
  static tableName = 'parcels'
  static columnNames = [
    'id',
    'x',
    'y',
    'asset_id',
    'auction_price',
    'owner',
    'data',
    'district_id'
  ]

  static buildId(x, y) {
    if (x == null || y == null) {
      throw new Error(
        `You need to supply both coordinates to be able to hash them. x = ${x} y = ${y}`
      )
    }

    return `${x},${y}`
  }

  static splitId(id = '') {
    const coordinates = id.split(',')

    if (coordinates.length !== 2) {
      throw new Error(`You need to supply a valid id to split. id = ${id}`)
    }

    return coordinates
  }

  static async findInIds(ids) {
    if (ids.length === 0) return []
    const inPlaceholders = ids.map((id, index) => `$${index + 1}`)

    return await this.db.query(
      `SELECT * FROM ${this.tableName} WHERE id IN (${inPlaceholders})`,
      ids
    )
  }

  static async findByOwner(owner) {
    return await this.db.query(
      `${this.findParcelsWithOpenPublicationSql()}
        WHERE par.owner = $1`,
      [owner]
    )
  }

  static async inRange(min, max) {
    const [minx, miny] = coordinates.toArray(min)
    const [maxx, maxy] = coordinates.toArray(max)

    return await this.db.query(
      `${this.findParcelsWithOpenPublicationSql()}
        WHERE par.x >= $1 AND par.y >= $2
          AND par.x <= $3 AND par.y <= $4`,
      [minx, miny, maxx, maxy]
    )
  }

  static findParcelsWithOpenPublicationSql() {
    return `SELECT par.*, (
        SELECT row_to_json(pub.*)
          FROM ${Publication.tableName} AS pub
          WHERE pub.status = '${Publication.STATUS.open}'
            AND pub.x = par.x
            AND pub.y = par.y
          ORDER BY pub.created_at DESC
          LIMIT 1
      ) as publication
        FROM ${this.tableName} as par`
  }

  static async encodeAssetId(x, y) {
    const rows = await this.db.query(
      `SELECT asset_id
        FROM ${this.tableName}
        WHERE x = $1
          AND y = $2
        LIMIT 1`,
      [x, y]
    )
    return rows.length ? rows[0].asset_id : null
  }

  static async decodeAssetId(assetId) {
    const rows = await this.db.query(
      `SELECT id
        FROM ${this.tableName}
        WHERE asset_id = $1
        LIMIT 1`,
      [assetId]
    )
    return rows.length ? rows[0].id : null
  }

  static async insert(parcel) {
    const { x, y } = parcel
    parcel.id = Parcel.buildId(x, y)

    return await super.insert(parcel)
  }
}
