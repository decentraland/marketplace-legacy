import { Model } from 'decentraland-commons'

import { coordinates } from './coordinates'
import { Asset } from '../Asset'
import { PublicationQueries } from '../Publication'
import { District } from '../District'
import { MortgageQueries } from '../Mortgage'
import { SQL } from '../database'

export class Parcel extends Model {
  static tableName = 'parcels'
  static columnNames = [
    'id',
    'x',
    'y',
    'asset_id',
    'owner',
    'data',
    'district_id',
    'in_estate',
    'tags',
    'auction_price',
    'auction_owner',
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

    return this.db.query(
      SQL`SELECT *
        FROM ${SQL.raw(this.tableName)}
        WHERE id = ANY(${ids})`
    )
  }

  static async findByOwner(owner) {
    return new Asset(this).findByOwner(owner)
  }

  static async findByOwnerAndStatus(owner, status) {
    return new Asset(this).findByOwnerAndStatus(owner, status)
  }

  static async findOwneableParcels() {
    return this.db.query(
      `SELECT *
        FROM ${SQL.raw(this.tableName)}
        WHERE district_id IS NULL`
    )
  }

  static async findLandmarks() {
    return this.db.query(
      `SELECT *
        FROM ${SQL.raw(this.tableName)}
        WHERE district_id IS NOT NULL`
    )
  }

  static async inRange(min, max) {
    const [minx, maxy] =
      typeof min === 'string' ? coordinates.toArray(min) : [min.x, min.y]
    const [maxx, miny] =
      typeof max === 'string' ? coordinates.toArray(max) : [max.x, max.y]
    return this.db.query(SQL`SELECT *, (
      ${PublicationQueries.findLastAssetPublicationJsonSql(this.tableName)}
    ) as publication
      FROM ${SQL.raw(this.tableName)}
      WHERE x BETWEEN ${minx} AND ${maxx}
        AND y BETWEEN ${miny} AND ${maxy}`)
  }

  static async encodeAssetId(x, y) {
    const rows = await this.db.query(
      SQL`SELECT asset_id
        FROM ${SQL.raw(this.tableName)}
        WHERE x = ${x}
          AND y = ${y}
        LIMIT 1`
    )
    return rows.length ? rows[0].asset_id : null
  }

  static async decodeAssetId(assetId) {
    const rows = await this.db.query(
      SQL`SELECT id
        FROM ${SQL.raw(this.tableName)}
        WHERE asset_id = ${assetId}
        LIMIT 1`
    )
    return rows.length ? rows[0].id : null
  }

  static async insert(parcel) {
    const { x, y } = parcel
    parcel.id = Parcel.buildId(x, y)

    return super.insert(parcel)
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

  static findWithLastActiveMortgageByBorrower(borrower) {
    return this.db.query(
      SQL`SELECT *, (
        ${PublicationQueries.findLastAssetPublicationJsonSql(this.tableName)}
      ) as publication
        FROM ${SQL.raw(this.tableName)}
        WHERE EXISTS(${MortgageQueries.findLastByBorrowerSql(borrower)})`
    )
  }
}
