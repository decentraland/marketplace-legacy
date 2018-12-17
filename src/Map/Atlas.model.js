import { Model } from 'decentraland-commons'

import { ParcelLocation } from './ParcelLocation'
import { ParcelReference } from './ParcelReference'
import { Asset, Estate, Parcel, ParcelQueries } from '../Asset'
import { Contribution } from '../Contribution'
import { District } from '../District'
import { Publication } from '../Publication'
import { SQL, raw } from '../database'
import { asyncPool } from '../lib'
import { isDistrict } from '../../shared/district'
import { isEstate } from '../../shared/parcel'
import { ASSET_TYPES } from '../../shared/asset'
import { PUBLICATION_STATUS } from '../shared/publication'

export class Atlas extends Model {
  static tableName = 'atlas'
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
    return asyncPool(
      estate.data.parcels,
      ({ x, y }) =>
        Parcel.findOne({ x, y }).then(parcel => this.upsertParcel(parcel)),
      10
    )
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

  static async inRangePNG(topLeft, bottomRight) {
    return this.db.query(SQL`
      SELECT x, y, type, is_connected_left as left, is_connected_top as top, is_connected_topleft as "topLeft"
        FROM ${raw(this.tableName)}
        WHERE ${ParcelQueries.whereIsBetweenCoordinates(topLeft, bottomRight)}`)
  }

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

    let [restAtlas, districtAtlas, ownerAtlas] = await Promise.all([
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

    // TODO: This seems like the wrong way to model this. The idea is to decouple ParcelReference from Models
    // and Atlas.model.js from TYPES and COLORS. but `getForContribution` and `getForOwner` feel a bit out of place

    for (const row of districtAtlas) {
      if (row.has_contributed) {
        const parcelReference = new ParcelReference({ owner: row.owner })
        const type = parcelReference.getContributionType()
        Object.assign(row, { type })
      }
    }

    for (const row of ownerAtlas) {
      const parcelReference = new ParcelReference({ owner: row.owner })
      const type = parcelReference.getTypeForOwner(owner, row.type)
      Object.assign(row, { type })
    }

    return restAtlas.concat(districtAtlas).concat(ownerAtlas)
  }

  static filterColumnNames(names) {
    const filter = new Set(names)
    return this.columnNames.filter(columnName => !filter.has(columnName))
  }

  static async buildRow(parcel) {
    const [connections, reference] = await Promise.all([
      this.getConnections(parcel),
      this.getReference(parcel)
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

  static async getConnections(parcel) {
    const parcelLocation = new ParcelLocation(parcel)

    let is_connected_left = 0
    let is_connected_top = 0
    let is_connected_topleft = 0

    if (isEstate(parcel) || isDistrict(parcel)) {
      const { top, left, topLeft } = parcelLocation.getNeigbouringCoordinates()
      const connections = await Promise.all([
        Parcel.findOne(top).then(parcelLocation.isConnected),
        Parcel.findOne(left).then(parcelLocation.isConnected),
        Parcel.findOne(topLeft).then(parcelLocation.isConnected)
      ])
      is_connected_top = connections[0] ? 1 : 0
      is_connected_left = connections[1] ? 1 : 0
      is_connected_topleft = connections[2] ? 1 : 0
    }

    return { is_connected_left, is_connected_top, is_connected_topleft }
  }

  static async getReference(parcel) {
    const inEstate = isEstate(parcel)
    const assetId = inEstate ? parcel.estate_id : parcel.id

    const [openPublication, estate, district] = await Promise.all([
      Publication.findActiveByAssetIdWithStatus(
        assetId,
        PUBLICATION_STATUS.open
      ),
      inEstate ? Estate.findOne(parcel.estate_id) : null,
      isDistrict(parcel) ? District.findOne(parcel.district_id) : null
    ])

    const price = openPublication ? openPublication.price : null

    // TODO: This second argument is super weird
    const parcelReference = new ParcelReference(parcel, {
      isOnSale: !!openPublication,
      district,
      estate
    })
    const type = parcelReference.getType()

    return {
      price,
      type,
      estate_id: parcel.estate_id,
      asset_type: inEstate ? ASSET_TYPES.estate : ASSET_TYPES.parcel,
      owner: district ? null : inEstate ? estate.owner : parcel.owner,
      name: parcelReference.getNameByType(type)
    }
  }
}
