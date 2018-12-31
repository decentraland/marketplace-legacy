import { Parcel } from '../Asset'
import { isDistrict } from '../../shared/district'
import { TileType, TileLocation } from '../../shared/map'
import { isEstate } from '../../shared/parcel'
import { ASSET_TYPES } from '../../shared/asset'
import { isExpired } from '../../shared/publication'

export class TileAttributes {
  constructor(parcel) {
    this.parcel = parcel
    this.isEstate = isEstate(parcel)
    this.isDistrict = isDistrict(parcel)

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

    const expires_at = publication ? publication.expires_at : null
    const price =
      publication && !isExpired(expires_at) ? publication.price : null

    return {
      type,
      expires_at,
      price,
      name: this.tileType.getName(type),
      owner: this.getOwner(),
      estate_id: this.parcel.estate_id,
      asset_type: this.isEstate ? ASSET_TYPES.estate : ASSET_TYPES.parcel
    }
  }

  getOwner() {
    return this.parcel.district_id
      ? null
      : this.isEstate
        ? this.parcel.estate.owner
        : this.parcel.owner
  }
}
