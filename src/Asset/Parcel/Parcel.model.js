import { Model } from 'decentraland-server'

import { ParcelQueries } from './Parcel.queries'
import { Asset } from '../Asset'
import { PublicationQueries } from '../../Listing'
import { District } from '../../District'
import { MortgageQueries } from '../../Mortgage'
import { ApprovalQueries } from '../../Approval'
import { SQL } from '../../database'
import { buildCoordinate, splitCoordinate } from '../../shared/coordinates'
import { ASSET_TYPES } from '../../shared/asset'

export class Parcel extends Model {
  static tableName = 'parcels'
  static columnNames = [
    'id',
    'x',
    'y',
    'token_id',
    'owner',
    'operator',
    'update_operator',
    'data',
    'district_id',
    'estate_id',
    'tags',
    'auction_price',
    'auction_owner',
    'last_transferred_at'
  ]

  static buildId(x, y) {
    return buildCoordinate(x, y)
  }

  static splitId(id) {
    return splitCoordinate(id)
  }

  static async findById(id) {
    return new Asset(this).findById(id)
  }

  static async findByOwner(owner) {
    return new Asset(this).findByOwner(owner)
  }

  static async findByOwnerAndStatus(owner, status) {
    return new Asset(this).findByOwnerAndStatus(owner, status)
  }

  static findApprovals(id) {
    return new Asset(this).findApprovals(id)
  }

  static async findByIds(ids) {
    return this.query(
      SQL`SELECT *
        FROM ${SQL.raw(this.tableName)}
        WHERE id = ANY(${ids})`
    )
  }

  static async findOwneableParcels() {
    return this.query(
      SQL`SELECT *
        FROM ${SQL.raw(this.tableName)}
        WHERE district_id IS NULL`
    )
  }

  static async findLandmarks() {
    return this.query(
      SQL`SELECT *
        FROM ${SQL.raw(this.tableName)}
        WHERE district_id IS NOT NULL`
    )
  }

  static findWithLastActiveMortgageByBorrower(borrower) {
    return this.query(
      SQL`SELECT *, (
        ${PublicationQueries.findLastAssetPublicationJsonSql(this.tableName)}
      ) as publication,
        ${ApprovalQueries.selectAssetApprovals(
          ASSET_TYPES.parcel,
          this.tableName
        )}
        FROM ${SQL.raw(this.tableName)}
        WHERE EXISTS(${MortgageQueries.findLastByBorrowerSql(borrower)})`
    )
  }

  static async findAvailable() {
    const parcels = await this.query(
      SQL`SELECT *
        FROM ${SQL.raw(this.tableName)}
        WHERE owner IS NULL
          AND district_id IS NULL
        ORDER BY RANDOM()
        LIMIT 1`
    )
    return parcels[0]
  }

  static async findFrom(fromDate) {
    return this.query(SQL`
      SELECT *
        FROM ${SQL.raw(this.tableName)}
        WHERE updated_at >= ${fromDate}`)
  }

  static async countAvailable() {
    const result = await this.query(
      SQL`SELECT COUNT(*)
        FROM ${SQL.raw(this.tableName)}
        WHERE owner IS NULL
          AND district_id IS NULL`
    )
    return parseInt(result[0].count, 10)
  }

  static async inRange(topLeft, bottomRight) {
    return this.query(SQL`SELECT *, (
      ${PublicationQueries.findLastAssetPublicationJsonSql(this.tableName)}
    ) as publication
      FROM ${SQL.raw(this.tableName)}
      WHERE ${ParcelQueries.whereIsBetweenCoordinates(topLeft, bottomRight)}
      ORDER BY x ASC, y DESC`)
  }

  static async encodeTokenId(x, y) {
    const rows = await this.query(
      SQL`SELECT token_id
        FROM ${SQL.raw(this.tableName)}
        WHERE x = ${x}
          AND y = ${y}
        LIMIT 1`
    )
    return rows.length ? rows[0].token_id : null
  }

  static async decodeTokenId(tokenId) {
    const rows = await this.query(
      SQL`SELECT id
        FROM ${SQL.raw(this.tableName)}
        WHERE token_id = ${tokenId}
        LIMIT 1`
    )

    return rows.length ? rows[0].id : null
  }

  static async updateAuctionData(price, owner, timestamp, ids) {
    return this.query(
      SQL`UPDATE ${SQL.raw(this.tableName)}
        SET auction_price = ${price},
            auction_owner = ${owner},
            auction_timestamp = ${timestamp},
            updated_at = NOW()
        WHERE id = ANY(${ids})`
    )
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
}
