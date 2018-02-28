import { Model } from 'decentraland-commons'

import { coordinates } from './coordinates'
import { Publication } from '../Publication'

export class Parcel extends Model {
  static tableName = 'parcels'
  static columnNames = [
    'id',
    'x',
    'y',
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
      `SELECT DISTINCT ON(par.id, pub.status) par.*, row_to_json(pub.*) as publication
        FROM ${this.tableName} as par
        LEFT JOIN (
          ${Publication.findOpenSql(Publication.STATUS.open)}
        ) as pub ON par."x" = pub."x" AND par."y" = pub."y"
        WHERE par.owner = $1`,
      [owner]
    )
  }

  static async inRange(min, max) {
    const [minx, miny] = coordinates.toArray(min)
    const [maxx, maxy] = coordinates.toArray(max)

    return await this.db.query(
      `SELECT par.*, (
        SELECT row_to_json(pub.*)
          FROM ${Publication.tableName} AS pub
          WHERE pub.status = '${Publication.STATUS.open}'
            AND pub.x = par.x
            AND pub.y = par.y
          ORDER BY pub.created_at DESC
          LIMIT 1
      ) as publication
        FROM ${this.tableName} as par
        WHERE par.x >= $1 AND par.y >= $2
          AND par.x <= $3 AND par.y <= $4`,
      [minx, miny, maxx, maxy]
    )
  }

  static async getPrice(x, y) {
    const result = await this.db.query(
      `SELECT auction_price
        FROM ${this.tableName}
        WHERE x = $1 AND y = $2`,
      [x, y]
    )

    return result.length ? result[0].auction_price : 0
  }

  static async insert(parcel) {
    const { x, y } = parcel
    parcel.id = Parcel.buildId(x, y)

    return await super.insert(parcel)
  }
}
