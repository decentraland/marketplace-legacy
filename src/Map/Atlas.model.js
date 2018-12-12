import { Model } from 'decentraland-commons'

import { ParcelLocation } from './ParcelLocation'
import { ParcelReference } from './ParcelReference'
import { Parcel, Estate } from '../Asset'
import { Contribution } from '../Contribution'
import { District } from '../District'
import { Publication } from '../Publication'
import { SQL, raw } from '../database'
import { splitCoordinate } from '../../shared/coordinates'
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
    'district_id',
    'estate_id',
    'owner',
    'price',
    'label',
    'type',
    'color',
    'asset_type',
    'is_connected_left',
    'is_connected_top',
    'is_connected_topleft'
  ]

  static async insertParcel(parcel) {
    return Atlas.insert(await Atlas.buildRow(parcel))
  }

  static async inRange(topLeft, bottomRight) {
    return this.db.query(SQL`
        SELECT *
          FROM ${raw(this.tableName)}
          WHERE ${this.getBetweenCoordinatesSQL(topLeft, bottomRight)}`)
  }

  static async inRangeFromAddressPerspective(topLeft, bottomRight, owner) {
    const betweenSQL = this.getBetweenCoordinatesSQL(topLeft, bottomRight)

    let [restAtlas, districtAtlas, ownerAtlas] = await Promise.all([
      this.db.query(SQL`
        SELECT *
          FROM ${raw(this.tableName)}
          WHERE (owner != ${owner} or owner IS NULL)
            AND district_id IS NULL
            AND ${betweenSQL}`),
      // prettier-ignore
      this.db.query(SQL`
        SELECT *,
            (SELECT 1 FROM ${raw(Contribution.tableName)} c WHERE c.address = ${owner} AND c.district_id = a.district_id) has_contributed
          FROM ${raw(this.tableName)} a
          WHERE (owner != ${owner} or owner IS NULL)
            AND district_id IS NOT NULL
            AND ${betweenSQL}`),
      this.db.query(SQL`
        SELECT *
          FROM ${raw(this.tableName)}
          WHERE owner = ${owner}
            AND ${betweenSQL}`)
    ])

    // TODO: This seems like the wrong way to model this. The idea is to decouple ParcelReference from Models
    // and Atlas.model.js from TYPES and COLORS. but `getForContribution` and `getForOwner` feel a bit out of place

    for (const row of districtAtlas) {
      if (row.has_contributed) {
        const parcelReference = new ParcelReference({ owner: row.owner })
        const reference = parcelReference.getForContribution()
        Object.assign(row, reference)
      }
    }

    for (const row of ownerAtlas) {
      const parcelReference = new ParcelReference({ owner: row.owner })
      const reference = parcelReference.getForOwner(owner, row.type)
      Object.assign(row, reference)
    }

    return restAtlas.concat(districtAtlas).concat(ownerAtlas)
  }

  // TODO: Move to ParcelCoordinates and use in Parcel.inRange too
  static getBetweenCoordinatesSQL(topLeft, bottomRight) {
    if (topLeft == null || bottomRight == null) {
      return SQL`1 = 1`
    }

    const [minx, maxy] =
      typeof topLeft === 'string'
        ? splitCoordinate(topLeft)
        : [topLeft.x, topLeft.y]

    const [maxx, miny] =
      typeof bottomRight === 'string'
        ? splitCoordinate(bottomRight)
        : [bottomRight.x, bottomRight.y]

    return SQL`x BETWEEN ${minx} AND ${maxx} AND y BETWEEN ${miny} AND ${maxy}`
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

    let is_connected_left = false
    let is_connected_top = false
    let is_connected_topleft = false

    if (isEstate(parcel) || isDistrict(parcel)) {
      const { top, left, topLeft } = parcelLocation.getNeigbouringCoordinates()
      const connections = await Promise.all([
        Parcel.findOne(top).then(parcelLocation.isConnected),
        Parcel.findOne(left).then(parcelLocation.isConnected),
        Parcel.findOne(topLeft).then(parcelLocation.isConnected)
      ])
      is_connected_top = connections[0]
      is_connected_left = connections[1]
      is_connected_topleft = connections[2]
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
      owner: inEstate ? estate.owner : parcel.owner,
      label: parcelReference.getLabelByType(type),
      color: parcelReference.getColorByType(type)
    }
  }
}
