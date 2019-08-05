import { Model } from 'decentraland-server'

import { TileAttributes } from './TileAttributes'
import { Asset, Parcel, Estate } from '../Asset'
import { Contribution } from '../Contribution'
import { District } from '../District'
import { Publication } from '../Listing'
import { SQL, raw } from '../database'
import { asyncBatch } from '../lib'
import { isDistrict } from '../../shared/district'
import { TileType, TileOwnerType } from '../../shared/map'
import { isPartOfEstate } from '../../shared/parcel'
import { ASSET_TYPES } from '../shared/asset'
import { LISTING_STATUS } from '../shared/listing'
import { flattenRoleAddresses } from '../shared/roles'

const propertiesBlacklist = ['district_id', 'asset_type']

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
    'approvals',
    'is_connected_left',
    'is_connected_top',
    'is_connected_topleft'
  ]

  static async updateApprovals(tile) {
    const assetApprovals = await Asset.getNew(tile.asset_type).findApprovals(
      tile.estate_id || tile.id
    )

    return Tile.update(
      { approvals: flattenRoleAddresses(assetApprovals) }, // Mocking an asset by just using the approvals
      { id: tile.id }
    )
  }

  static findByAnyApproval(address) {
    return this.query(
      SQL`SELECT *
        FROM ${raw(this.tableName)}
        WHERE ${address} = ANY(approvals)`
    )
  }

  static async findFrom(fromDate) {
    const columnNames = this.filterColumnNames(propertiesBlacklist).join(', ')

    return this.query(SQL`
      SELECT ${raw(columnNames)}
        FROM ${raw(this.tableName)}
        WHERE ${this.getWhereUpdatedSQL(fromDate)}`)
  }

  static async upsertAsset(assetId, assetType) {
    // getNew throws if the assetType is invalid
    const asset = await Asset.getNew(assetType).findById(assetId)

    if (!asset) {
      // Some Estates appear as undefined
      return
    }
    switch (assetType) {
      case ASSET_TYPES.parcel:
        return this.upsertParcel(asset)
      case ASSET_TYPES.estate:
        return this.upsertEstate(asset)
      default:
        break
    }
  }

  static async upsertEstate(estate) {
    return asyncBatch({
      elements: estate.data.parcels,
      callback: async parcelsBatch => {
        const promises = []

        for (const { x, y } of parcelsBatch) {
          promises.push(
            Parcel.findOne({ x, y }).then(parcel => this.upsertParcel(parcel))
          )
        }

        await Promise.all(promises)
      },
      batchSize: 20,
      logFormat: ''
    })
  }

  static async upsertParcel(parcel) {
    const now = new Date()
    const row = await this.buildRow(parcel)

    row.created_at = now
    row.updated_at = now

    const values = Object.values(row)

    return this.query(
      `INSERT INTO ${this.tableName}(
       ${this.db.toColumnFields(row)}
      ) VALUES(
       ${this.db.toValuePlaceholders(row)}
      ) ON CONFLICT (id) DO UPDATE SET
        ${this.db.toAssignmentFields(row)};`,
      values
    )
  }

  /**
   * Returns the tiles changing the type according to the supplied address.
   * For example if the address has a tile on sale the db type will be TYPES.taken but will be chaged to TYPES.myParcelsOnSale here
   * @return {array}
   */
  static async getForOwner(owner, fromDate) {
    const districtColumnNames = this.filterColumnNames(
      ['owner', 'price', 'estate_id', ...propertiesBlacklist],
      'tiles'
    ).join(', ')
    const ownerColumnNames = this.filterColumnNames(
      propertiesBlacklist,
      'tiles'
    ).join(', ')

    const whereNewSQL = fromDate
      ? this.getWhereUpdatedSQL(fromDate, 'tiles')
      : SQL`1 = 1`

    const [districtTiles, ownerTiles] = await Promise.all([
      // prettier-ignore
      this.query(SQL`
        SELECT ${raw(districtColumnNames)}
          FROM ${raw(this.tableName)} tiles
          JOIN ${raw(Contribution.tableName)} c ON c.address = ${owner} AND c.district_id = tiles.district_id
          WHERE (tiles.owner != ${owner} OR tiles.owner IS NULL)
            AND tiles.district_id IS NOT NULL
            AND ${whereNewSQL}
          GROUP BY c.id, ${raw(districtColumnNames)}`),
      this.query(SQL`
        SELECT ${raw(ownerColumnNames)}
          FROM ${raw(this.tableName)} tiles
          WHERE (owner = ${owner} OR ${owner} = ANY(approvals))
            AND ${whereNewSQL}`)
    ])

    for (const tile of districtTiles) {
      // Mock a contribution for perf reasons
      const parcel = { owner, contribution: { id: tile.id } }
      const tileType = new TileType(parcel)
      tile.type = tileType.get()
    }

    for (const tile of ownerTiles) {
      const tileOwnerType = new TileOwnerType(owner)
      tile.type = tileOwnerType.get(tile)
    }

    return districtTiles.concat(ownerTiles)
  }

  static async buildRow(parcel) {
    const fullParcel = await this.getFullParcel(parcel)
    const tileAttributes = new TileAttributes(fullParcel)

    const [connections, reference] = await Promise.all([
      tileAttributes.getConnections(),
      tileAttributes.getReference()
    ])
    const approvals = tileAttributes.getApprovals()

    return {
      id: parcel.id,
      x: parcel.x,
      y: parcel.y,
      district_id: parcel.district_id,
      approvals,
      ...reference,
      ...connections
    }
  }

  static async getFullParcel(parcel) {
    const isEstate = isPartOfEstate(parcel)

    const assetId = isEstate ? parcel.estate_id : parcel.id

    const approvalsPromise = isEstate
      ? Estate.findApprovals(parcel.estate_id)
      : Parcel.findApprovals(parcel.id)

    const publicationPromise = Publication.findActiveByAssetIdWithStatus(
      assetId,
      LISTING_STATUS.open
    )

    const estatePromise = isEstate ? Estate.findOne(parcel.estate_id) : null

    const districtPromise = isDistrict(parcel)
      ? District.findOne(parcel.district_id)
      : null

    const [approvals, publication, estate, district] = await Promise.all([
      approvalsPromise,
      publicationPromise,
      estatePromise,
      districtPromise
    ])

    const fullParcel = { ...parcel, estate, district }

    // Assign attributes to the correct asset
    const asset = isEstate ? fullParcel.estate : fullParcel
    Object.assign(asset, approvals, { publication })

    return fullParcel
  }

  static getWhereUpdatedSQL(fromDate, alias = this.tableName) {
    return SQL`(${raw(alias)}.updated_at >= ${fromDate})`
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
}
