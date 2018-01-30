import { arrayOf, shape, string, number, bool } from 'prop-types'

export const parcelType = shape({
  id: string.isRequired,
  district_id: string,
  price: string,
  address: string,
  x: number.isRequired,
  y: number.isRequired
})

export const transferType = shape({
  hash: string,
  oldOwner: string,
  newOwner: string
})

export const districtType = shape({
  id: string.isRequired,
  center: string.isRequired,
  description: string.isRequired,
  link: string.isRequired,
  name: string.isRequired,
  parcel_count: string.isRequired,
  priority: number.isRequired,
  public: bool.isRequired
})

export const addressType = shape({
  parcel_ids: arrayOf(string).isRequired,
  parcels: arrayOf(parcelType).isRequired
})

export const walletType = shape({
  address: string,
  parcels: arrayOf(parcelType).isRequired
})
