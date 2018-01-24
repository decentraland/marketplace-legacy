import {
  arrayOf,
  oneOfType,
  shape,
  object,
  string,
  number,
  bool
} from 'prop-types'

export function getStateData(data) {
  return shape({
    data,
    loading: bool,
    error: oneOfType([object, string])
  })
}

export const parcelType = shape({
  id: string.isRequired,
  district_id: string,
  price: string,
  address: string,
  x: number.isRequired,
  y: number.isRequired
})

export const districtType = shape({
  id: string.isRequired,
  center: string.isRequired,
  description: string.isRequired,
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
