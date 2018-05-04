import { Model } from 'decentraland-commons'

import { coordinates } from './coordinates'
import { Publication } from '../Publication'
import { District } from '../District'

export class Parcel extends Model {
  static tableName = 'parcels'
  static columnNames = [
    'id',
    'x',
    'y',
    'asset_id',
    'auction_price',
    'auction_owner',
    'owner',
    'data',
    'district_id',
    'tags',
    'last_transferred_at'
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
      `SELECT *
        FROM ${this.tableName}
        WHERE id IN (${inPlaceholders})`,
      ids
    )
  }

  static async findByOwner(owner) {
    return await this.db.query(
      `SELECT ${this.tableName}.*, (
        ${Publication.findLastParcelPublicationJsonSql()}
      ) as publication
        FROM ${this.tableName}
        WHERE owner = $1`,
      [owner]
    )
  }

  static async findByOwnerAndStatus(owner, status) {
    return await this.db.query(
      `SELECT DISTINCT ON(par.id, pub.status) par.*, row_to_json(pub.*) as publication
        FROM ${this.tableName} as par
        LEFT JOIN (
          ${Publication.findPublicationsByStatusSql(status)}
        ) as pub ON par.x = pub.x AND par.y = pub.y
        WHERE par.owner = $1
          AND pub.tx_hash IS NOT NULL`,
      [owner]
    )
  }

  static async findOwneableParcels() {
    return await this.db.query(
      `SELECT *
        FROM ${this.tableName}
        WHERE district_id IS NULL`
    )
  }

  static async findLandmarks() {
    return await this.db.query(
      `SELECT *
        FROM ${this.tableName}
        WHERE district_id IS NOT NULL`
    )
  }

  static async inRange(min, max) {
    const [minx, miny] = coordinates.toArray(min)
    const [maxx, maxy] = coordinates.toArray(max)

    return await this.db.query(
      `SELECT ${this.tableName}.*, (
        ${Publication.findLastParcelPublicationJsonSql()}
      ) as publication
        FROM ${this.tableName}
        WHERE x >= $1 AND y >= $2
          AND x <= $3 AND y <= $4`,
      [minx, miny, maxx, maxy]
    )
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

  isEqual(parcel) {
    return (
      this.attributes.id === parcel.attributes.id ||
      (this.attributes.x === parcel.attributes.x &&
        this.attributes.y === parcel.attributes.y)
    )
  }

  distanceTo(parcel) {
    // Chebyshev distance
    return Math.max(
      Math.abs(this.attributes.x - parcel.attributes.x),
      Math.abs(this.attributes.y - parcel.attributes.y)
    )
  }

  isWithinBoundingBox(parcel, size) {
    return (
      Math.abs(this.attributes.x - parcel.attributes.x) <= size &&
      Math.abs(this.attributes.y - parcel.attributes.y) <= size
    )
  }

  isPlaza() {
    return District.isPlaza(this.attributes.district_id)
  }

  isRoad() {
    return District.isRoad(this.attributes.district_id)
  }
}
