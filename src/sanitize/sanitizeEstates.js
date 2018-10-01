import { utils } from 'decentraland-commons'

const BLACKLISTED_PROPERTIES = ['created_at', 'updated_at']

export function sanitizeEstates(estates) {
  return utils.mapOmit(estates, BLACKLISTED_PROPERTIES)
}

export function sanitizeEstate(estate) {
  return utils.omit(estate, BLACKLISTED_PROPERTIES)
}
