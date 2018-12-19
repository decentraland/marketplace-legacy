import { Model } from 'decentraland-commons'

import { TileAttributes } from './TileAttributes'
import { TileType } from './TileType'
import { Estate, ParcelQueries } from '../Asset'
import { Contribution } from '../Contribution'
import { District } from '../District'
import { Publication } from '../Publication'
import { SQL, raw } from '../database'
import { isDistrict } from '../../shared/district'
import { isEstate } from '../../shared/parcel'
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

  static async inRangePNG(topLeft, bottomRight) {
    return this.db.query(SQL`
      SELECT x, y, type, is_connected_left as left, is_connected_top as top, is_connected_topleft as "topLeft"
        FROM ${raw(this.tableName)}
        WHERE ${ParcelQueries.whereIsBetweenCoordinates(topLeft, bottomRight)}`)
  }

  /**
   * Returns the tiles form the database changing the type according to the supplied wallet.
   * So for example if a tile is on sale the type will be TYPES.taken and changed to TYPES.myParcelsOnSale here
   */
  static async inRangeFromAddressPerspective(topLeft, bottomRight, owner) {
    const betweenSQL = ParcelQueries.whereIsBetweenCoordinates(
      topLeft,
      bottomRight
    )

    const restColumnNames = this.filterColumnNames([
      'district_id',
      'asset_type'
    ]).join(', ')
    const districtColumnNames = this.filterColumnNames([
      'price',
      'owner',
      'estate_id',
      'district_id',
      'asset_type'
    ]).join(', ')
    const ownerColumnNames = this.filterColumnNames([
      'owner',
      'district_id',
      'asset_type'
    ]).join(', ')

    let [restTiles, districtTiles, ownerTiles] = await Promise.all([
      this.db.query(SQL`
        SELECT ${raw(restColumnNames)}
          FROM ${raw(this.tableName)}
          WHERE (owner != ${owner} OR owner IS NULL)
            AND district_id IS NULL
            AND ${betweenSQL}`),
      // prettier-ignore
      this.db.query(SQL`
        SELECT ${raw(districtColumnNames)},
            (SELECT 1 FROM ${raw(Contribution.tableName)} c WHERE c.address = ${owner} AND c.district_id = a.district_id) has_contributed
          FROM ${raw(this.tableName)} a
          WHERE (owner != ${owner} or owner IS NULL)
            AND district_id IS NOT NULL
            AND ${betweenSQL}`),
      this.db.query(SQL`
        SELECT ${raw(ownerColumnNames)}
          FROM ${raw(this.tableName)}
          WHERE owner = ${owner}
            AND ${betweenSQL}`)
    ])

    for (const tile of districtTiles) {
      if (tile.has_contributed) {
        // Mock a contribution for perf reasons
        const tileAttributes = new TileType({
          owner: tile.owner,
          contributions: [1]
        })
        const type = tileAttributes.getType()
        Object.assign(tile, { type })
      }
    }

    for (const tile of ownerTiles) {
      const tileAttributes = new TileType({ owner })
      const type = tileAttributes.getForOwner(owner, tile.type)
      Object.assign(tile, { type })
    }

    return restTiles.concat(districtTiles).concat(ownerTiles)
  }

  static filterColumnNames(names) {
    const filter = new Set(names)
    return this.columnNames.filter(columnName => !filter.has(columnName))
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

    if (parcel.id === '-44,-127') {
      console.log('PARCEL', parcel)
      console.log('PARCEL publication', publication)
      console.log('PARCEL estate', estate)
      console.log('PARCEL district', district)
    }

    return { ...parcel, publication, estate, district }
  }
}
