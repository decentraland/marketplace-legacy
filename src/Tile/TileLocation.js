export class TileLocation {
  constructor(parcel) {
    this.parcel = parcel
  }

  getNeigbouringCoordinates() {
    const { x, y } = this.parcel

    return {
      left: { x: x - 1, y },
      right: { x: x + 1, y },
      top: { x, y: y + 1 },
      bottom: { x, y: y - 1 },
      topLeft: { x: x - 1, y: y + 1 },
      bottomRight: { x: x + 1, y: y - 1 }
    }
  }

  isConnected = sideParcel => {
    if (!sideParcel) {
      return false
    }

    const isSameDistrict = this.parcel.district_id === sideParcel.district_id
    if (this.parcel.district_id && isSameDistrict) {
      return true
    }

    const isSameEstate = this.parcel.estate_id === sideParcel.estate_id
    return !!this.parcel.estate_id && isSameEstate
  }
}
