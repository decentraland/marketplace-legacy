import { utils } from 'decentraland-commons'

const BLACKLISTED_PROPERTIES = ['token_id', 'created_at', 'updated_at']

export function blacklistParcels(parcels) {
  return utils.mapOmit(parcels, BLACKLISTED_PROPERTIES)
}
