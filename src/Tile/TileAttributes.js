import { Parcel } from '../Asset'
import { isDistrict } from '../../shared/district'
import { TileType, TileLocation } from '../../shared/map'
import { isPartOfEstate } from '../../shared/parcel'
import { ASSET_TYPES } from '../../shared/asset'

export class TileAttributes {
  constructor(parcel) {
    this.parcel = parcel
    this.isEstate = isPartOfEstate(parcel)
    this.isDistrict = isDistrict(parcel)
    this.asset = this.isEstate ? parcel.estate : parcel

    this.tileLocation = new TileLocation(parcel)
    this.tileType = new TileType(parcel)
  }

  async getConnections() {
    let is_connected_left = 0
    let is_connected_top = 0
    let is_connected_topleft = 0

    if (this.isEstate || this.isDistrict) {
      const {
        top,
        left,
        topLeft
      } = this.tileLocation.getNeigbouringCoordinates()

      const connections = await Promise.all([
        Parcel.findOne(top).then(this.tileLocation.isConnected),
        Parcel.findOne(left).then(this.tileLocation.isConnected),
        Parcel.findOne(topLeft).then(this.tileLocation.isConnected)
      ])
      is_connected_top = connections[0] ? 1 : 0
      is_connected_left = connections[1] ? 1 : 0
      is_connected_topleft = connections[2] ? 1 : 0
    }

    return { is_connected_left, is_connected_top, is_connected_topleft }
  }

  async getReference() {
    const type = this.tileType.get()
    const publication = this.parcel.publication

    return {
      type,
      price: publication ? publication.price : null,
      name: this.tileType.getName(type),
      owner: this.getOwner(),
      estate_id: this.parcel.estate_id,
      asset_type: this.isEstate ? ASSET_TYPES.estate : ASSET_TYPES.parcel
    }
  }

  getApprovals() {
    if (this.isDistrict) {
      return []
    }

    const approvals = new Set([
      ...this.asset.update_managers,
      ...this.asset.operators_for_all
    ])

    if (this.asset.operator) {
      approvals.add(this.asset.operator)
    }
    if (this.asset.update_operator) {
      approvals.add(this.asset.update_operator)
    }

    return Array.from(approvals)
  }

  getOwner() {
    return this.isDistrict ? null : this.asset.owner
  }
}
