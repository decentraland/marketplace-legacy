import { utils } from 'decentraland-commons'

const BLACKLISTED_PROPERTIES = ['created_at', 'updated_at']

export function sanitizePublications(publications) {
  return utils.mapOmit(publications, BLACKLISTED_PROPERTIES)
}

export function sanitizePublication(publication) {
  return utils.omit(publication, BLACKLISTED_PROPERTIES)
}
