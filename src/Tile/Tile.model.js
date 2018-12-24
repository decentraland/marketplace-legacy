import { Model } from 'decentraland-commons'

import { TileAttributes } from './TileAttributes'
import { Asset, Parcel, Estate, ParcelQueries } from '../Asset'
import { Contribution } from '../Contribution'
import { District } from '../District'
import { Publication } from '../Publication'
import { SQL, raw } from '../database'
import { asyncBatch } from '../lib'
import { isDistrict } from '../../shared/district'
import { TileType } from '../../shared/map'
import { isEstate } from '../../shared/parcel'
import { ASSET_TYPES } from '../shared/asset'
import { PUBLICATION_STATUS } from '../shared/publication'

export class Tile extends Model {
  static tableName = 'tiles'
  static columnNames = [
    'id',
    'x',
    'y',
    'estate_id',
    'district_id',
    'owner',
    'price',
    'name',
    'type',
    'asset_type',
    'is_connected_left',
    'is_connected_top',
    'is_connected_topleft'
  ]

  static async upsertAsset(assetId, assetType) {
    const asset = await Asset.getModel(assetType).findOne(assetId)

    switch (assetType) {
      case ASSET_TYPES.parcel:
        return this.upsertParcel(asset)
      case ASSET_TYPES.estate:
        return this.upsertEstate(asset)
      default:
        throw new Error(`The asset type ${assetType} is invalid`)
    }
  }

  static async upsertEstate(estate) {
    return asyncBatch({
      elements: estate.data.parcels,
      callback: async parcelsBatch => {
        const promises = []

        for (const { x, y } of parcelsBatch) {
          const parcel = await Parcel.findOne({ x, y })
          promises.push(this.upsertParcel(parcel))
        }

        await Promise.all(promises)
      },
      batchSize: 10,
      logFormat: ''
    })
  }

  static async upsertParcel(parcel) {
    const now = new Date()
    const row = await this.buildRow(parcel)

    row.created_at = now
    row.updated_at = now

    const values = Object.values(row)

    return this.db.query(
      `INSERT INTO ${this.tableName}(
       ${this.db.toColumnFields(row)}
      ) VALUES(
       ${this.db.toValuePlaceholders(row)}
      ) ON CONFLICT (id) DO UPDATE SET
        ${this.db.toAssignmentFields(row)};`,
      values
    )
  }

  static async inRange(topLeft, bottomRight) {
    const columnNames = this.filterColumnNames([
      'district_id',
      'asset_type'
    ]).join(', ')

    return this.db.query(SQL`
      SELECT ${raw(columnNames)}
        FROM ${raw(this.tableName)}
        WHERE ${ParcelQueries.whereIsBetweenCoordinates(topLeft, bottomRight)}`)
  }

  /**
   * Returns the tiles changing the type according to the supplied address.
   * For example if the address has a tile is on sale the db type will be TYPES.taken but will be chaged to TYPES.myParcelsOnSale here
   */
  static async getForOwner(owner) {
    const districtColumnNames = this.filterColumnNames(
      ['price', 'owner', 'estate_id', 'district_id', 'asset_type'],
      't'
    ).join(', ')
    const ownerColumnNames = this.filterColumnNames(
      ['owner', 'district_id', 'asset_type'],
      't'
    ).join(', ')

    const [districtTiles, ownerTiles] = await Promise.all([
      // prettier-ignore
      this.db.query(SQL`
        SELECT ${raw(districtColumnNames)}
          FROM ${raw(this.tableName)} t
          JOIN ${raw(Contribution.tableName)} c ON c.address = ${owner} AND c.district_id = t.district_id
          WHERE (t.owner != ${owner} OR t.owner IS NULL)
            AND t.district_id IS NOT NULL
          GROUP BY c.id, ${raw(districtColumnNames)}`),
      this.db.query(SQL`
        SELECT ${raw(ownerColumnNames)}
          FROM ${raw(this.tableName)} t
          WHERE owner = ${owner}`)
    ])

    for (const tile of districtTiles) {
      // Mock a contribution for perf reasons
      const tileType = new TileType({ owner, contribution: { id: tile.id } })
      tile.type = tileType.get()
    }

    for (const tile of ownerTiles) {
      const tileType = new TileType({ owner })
      tile.type = tileType.getForOwner(owner, tile.type)
    }

    return districtTiles.concat(ownerTiles)
  }

  static filterColumnNames(names, alias = this.tableName) {
    const filter = new Set(names)
    const result = []
    for (const columnName of this.columnNames) {
      if (!filter.has(columnName)) {
        result.push(`${alias}.${columnName}`)
      }
    }
    return result
  }

  static async buildRow(parcel) {
    const fullParcel = await this.getFullParcel(parcel)
    const tileAttributes = new TileAttributes(fullParcel)

    const [connections, reference] = await Promise.all([
      tileAttributes.getConnections(parcel),
      tileAttributes.getReference(parcel)
    ])

    return {
      id: parcel.id,
      x: parcel.x,
      y: parcel.y,
      district_id: parcel.district_id,
      ...reference,
      ...connections
    }
  }

  static async getFullParcel(parcel) {
    const assetId = isEstate(parcel) ? parcel.estate_id : parcel.id

    const publicationPromise =
      parcel.publication === undefined
        ? Publication.findActiveByAssetIdWithStatus(
            assetId,
            PUBLICATION_STATUS.open
          )
        : Promise.resolve(parcel.publication)

    const estatePromise =
      parcel.estate === undefined
        ? isEstate(parcel)
          ? Estate.findOne(parcel.estate_id)
          : null
        : Promise.resolve(parcel.estate)

    const districtPromise =
      parcel.district === undefined
        ? isDistrict(parcel)
          ? District.findOne(parcel.district_id)
          : null
        : Promise.resolve(parcel.district)

    const [publication, estate, district] = await Promise.all([
      publicationPromise,
      estatePromise,
      districtPromise
    ])

    return { ...parcel, publication, estate, district }
  }
}
