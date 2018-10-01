import { utils } from 'decentraland-commons'

const BLACKLISTED_PROPERTIES = ['created_at', 'updated_at']

export function blacklistPublications(publications) {
  return utils.mapOmit(publications, BLACKLISTED_PROPERTIES)
}
