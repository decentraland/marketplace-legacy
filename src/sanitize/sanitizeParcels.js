import { utils } from 'decentraland-commons'

const BLACKLISTED_PROPERTIES = ['token_id', 'created_at', 'updated_at']

export function sanitizeParcels(parcels) {
  return utils.mapOmit(parcels, BLACKLISTED_PROPERTIES)
}

export function sanitizeParcel(parcel) {
  return utils.omit(parcel, BLACKLISTED_PROPERTIES)
}
