import { utils } from 'decentraland-commons'

const BLACKLISTED_PROPERTIES = ['created_at', 'updated_at']

export function blacklistEstates(estates) {
  return utils.mapOmit(estates, BLACKLISTED_PROPERTIES)
}
