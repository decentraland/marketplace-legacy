import { Model } from 'decentraland-commons'

import { coordinates, SingleCoordinate, UnifiedCoordinate } from './coordinates'
import { Asset } from '../Asset'
import { PublicationQueries, Publication } from '../Publication'
import { District } from '../District'
import { SQL } from '../database'

// TODO: assets/parcel, assets/estate, assets/data
export interface Data {
  version: string
  name?: string
  description?: string
  metadata?: string
}
export interface Tag {
  proximity?: {
    plaza?: { district_id: string; distance: number }
    district?: { district_id: string; distance: number }
    road?: { district_id: string; distance: number }
  }
}
export interface ParcelAttributes {
  id?: string
  x: number
  y: number
  asset_id: string
  owner: string
  district_id: string
  in_state: boolean
  data: Data
  tags: Tag
  auction_price: number
  auction_owner: string
  last_transferred_at: number
  publication?: Publication
  created_at?: Date
  updated_at?: Date
}

export class Parcel extends Model {
  static tableName = 'parcels'
  static columnNames = [
    'id',
    'x',
    'y',
    'asset_id',
    'owner',
    'district_id',
    'in_state',
    'data',
    'tags',
    'auction_price',
    'auction_owner',
    'last_transferred_at'
  ]

  static buildId(x: SingleCoordinate, y: SingleCoordinate): string {
    if (x == null || y == null) {
      throw new Error(
        `You need to supply both coordinates to be able to hash them. x = ${x} y = ${y}`
      )
    }

    return `${x},${y}`
  }

  static splitId(id: string = ''): string[] {
    const coordinates = id.split(',')

    if (coordinates.length !== 2) {
      throw new Error(`You need to supply a valid id to split. id = ${id}`)
    }

    return coordinates
  }

  static async findByOwner(owner: string): Promise<ParcelAttributes[]> {
    return await new Asset(this).findByOwner(owner)
  }

  static async findByOwnerAndStatus(
    owner: string,
    status: string
  ): Promise<ParcelAttributes[]> {
    return new Asset(this).findByOwnerAndStatus(owner, status)
  }

  static async findOwneableParcels(): Promise<ParcelAttributes[]> {
    return await this.db.query(
      `SELECT *
        FROM ${SQL.raw(this.tableName)}
        WHERE district_id IS NULL`
    )
  }

  static async findLandmarks(): Promise<ParcelAttributes[]> {
    return await this.db.query(
      `SELECT *
        FROM ${SQL.raw(this.tableName)}
        WHERE district_id IS NOT NULL`
    )
  }

  static async inRange(
    min: UnifiedCoordinate,
    max: UnifiedCoordinate
  ): Promise<ParcelAttributes[]> {
    const [minx, maxy] = coordinates.toArray(min)
    const [maxx, miny] = coordinates.toArray(max)

    return await this.db.query(
      SQL`SELECT *, (
        ${PublicationQueries.findLastParcelPublicationJsonSql()}
      ) as publication
        FROM ${SQL.raw(this.tableName)}
        WHERE x BETWEEN ${minx} AND ${maxx}
          AND y BETWEEN ${miny} AND ${maxy}`
    )
  }

  static async encodeAssetId(
    x: SingleCoordinate,
    y: SingleCoordinate
  ): Promise<string> {
    const rows = await this.db.query(
      SQL`SELECT asset_id
        FROM ${SQL.raw(this.tableName)}
        WHERE x = ${x}
          AND y = ${y}
        LIMIT 1`
    )
    return rows.length ? rows[0].asset_id : null
  }

  static async decodeAssetId(assetId: string): Promise<string> {
    const rows = await this.db.query(
      SQL`SELECT id
        FROM ${SQL.raw(this.tableName)}
        WHERE asset_id = ${assetId}
        LIMIT 1`
    )
    return rows.length ? rows[0].id : null
  }

  static insert<T>(row: T): Promise<T>
  static insert(parcel: ParcelAttributes): Promise<ParcelAttributes> {
    const { x, y } = parcel
    parcel.id = Parcel.buildId(x, y)

    return super.insert(parcel)
  }

  attributes: ParcelAttributes

  isEqual(parcel: Parcel): boolean {
    return (
      this.attributes.id === parcel.attributes.id ||
      (this.attributes.x === parcel.attributes.x &&
        this.attributes.y === parcel.attributes.y)
    )
  }

  distanceTo(parcel: Parcel): number {
    // Chebyshev distance
    return Math.max(
      Math.abs(this.attributes.x - parcel.attributes.x),
      Math.abs(this.attributes.y - parcel.attributes.y)
    )
  }

  isWithinBoundingBox(parcel: Parcel, size: number): boolean {
    return (
      Math.abs(this.attributes.x - parcel.attributes.x) <= size &&
      Math.abs(this.attributes.y - parcel.attributes.y) <= size
    )
  }

  isPlaza(): boolean {
    return District.isPlaza(this.attributes.district_id)
  }

  isRoad(): boolean {
    return District.isRoad(this.attributes.district_id)
  }
}
