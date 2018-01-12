import { arrayOf, shape, string, number, bool } from 'prop-types'

export const parcelType = shape({
  district_id: string,
  id: string.isRequired,
  price: string,
  address: string,
  x: number.isRequired,
  y: number.isRequired
})

export const districtType = shape({
  center: string.isRequired,
  description: string.isRequired,
  id: string.isRequired,
  link: string.isRequired,
  name: string.isRequired,
  parcel_count: string,
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
