import { Model } from 'decentraland-commons'

import { ParcelLocation } from './ParcelLocation'
import { ParcelReference } from './ParcelReference'
import { Parcel, Estate } from '../Asset'
import { Contribution } from '../Contribution'
import { Publication } from '../Publication'
import { SQL } from '../database'
import { isDistrict } from '../../shared/district'
import { inEstate } from '../../shared/parcel'
import { PUBLICATION_STATUS } from '../shared/publication'

export class Atlas extends Model {
  static tableName = 'atlas'
  static columnNames = [
    'id',
    'x',
    'y',
    'district_id',
    'owner',
    'price',
    'name',
    'type',
    'color',
    'in_estate',
    'is_connected_left',
    'is_connected_top',
    'is_connected_topleft'
  ]

  static async insertParcel(parcel) {
    return Atlas.insert(await Atlas.buildRow(parcel))
  }

  static async findFromOwnerPerspective(owner) {
    let [restAtlas, districtAtlas, ownerAtlas] = await Promise.all([
      this.db.query(SQL`
        SELECT *
          FROM ${this.table}
          WHERE (owner != ${owner} or owner IS NULL)
            AND district_id IS NULL`),
      // prettier-ignore
      this.db.query(SQL`
        SELECT *, (select 1 from ${raw(Contribution.tableName)} c where c.address = ${owner} and c.district_id = a.district_id) has_contributed
            FROM ${this.table}
            WHERE (owner != ${owner} or owner IS NULL)
              AND district_id IS NOT NULL`),
      this.db.query(SQL`
        SELECT *
          FROM ${this.table} a
          WHERE owner = ${owner}`)
    ])

    // TODO: This seems like the wrong way to model this. The idea is to decouple ParcelReference from Models
    // and Atlas.model.js from TYPES and COLORS. but `getForContribution` and `getForOwner` feel a bit out of place

    for (const row of districtAtlas) {
      if (row.has_contributed) {
        const parcelReference = new ParcelReference({ owner: row.owner })
        const { type, color } = parcelReference.getForContribution()
        row.type = type
        row.color = color
      }
    }

    for (const row of ownerAtlas) {
      const parcelReference = new ParcelReference({ owner: row.owner })
      const { type, color } = parcelReference.getForOwner(owner, row.type)
      row.type = type
      row.color = color
    }

    return restAtlas.concat(districtAtlas).concat(ownerParcels)
  }

  static async buildRow(parcel) {
    const in_estate = inEstate(parcel)
    const { owner, data } = in_estate
      ? await Estate.findOne(parcel.estate_id)
      : parcel

    const connections = await this.getConnections(parcel)
    const traits = await this.getTraits(parcel)

    return {
      id: parcel.id,
      x: parcel.x,
      y: parcel.y,
      district_id: parcel.district_id,
      name: data.name,
      owner,
      in_estate,
      ...traits,
      ...connections
    }
  }

  static async getConnections(parcel) {
    const parcelLocation = new ParcelLocation(parcel)

    let is_connected_left = false
    let is_connected_top = false
    let is_connected_topleft = false

    if (inEstate(parcel) || isDistrict(parcel)) {
      const { top, left, topLeft } = parcelLocation.getNeigbouringCoordinates()
      const connections = await Promise.all([
        Parcel.findOne(top).then(parcelLocation.isConnected),
        Parcel.findOne(left).then(parcelLocation.isConnected),
        Parcel.findOne(topLeft).then(parcelLocation.isConnected)
      ])
      is_connected_left = connections[0]
      is_connected_top = connections[1]
      is_connected_topleft = connections[2]
    }

    return { is_connected_left, is_connected_top, is_connected_topleft }
  }

  static async getTraits(parcel) {
    const publications = await Publication.findActiveByAssetIdWithStatus(
      inEstate(parcel) ? parcel.estate_id : parcel.id,
      PUBLICATION_STATUS.open
    )
    const price = publications.length > 0 ? publications[0].price : null

    const parcelReference = new ParcelReference(parcel, publications)

    return {
      price,
      type: parcelReference.getType(),
      color: parcelReference.getColor()
    }
  }
}
