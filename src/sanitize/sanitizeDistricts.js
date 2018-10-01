import { utils } from 'decentraland-commons'

const BLACKLISTED_PROPERTIES = [
  'disabled',
  'address',
  'parcel_ids',
  'created_at',
  'updated_at'
]

export function sanitizeDistricts(districts) {
  return utils.mapOmit(districts, BLACKLISTED_PROPERTIES)
}
