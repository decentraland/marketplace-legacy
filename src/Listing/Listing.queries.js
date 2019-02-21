import { SQL } from '../database'

export const ListingQueries = Object.freeze({
  isInactive: () => SQL`expires_at < EXTRACT(epoch from now()) * 1000`,
  hasStatus: status => (status ? SQL`status = ${status}` : SQL`1 = 1`),
  hasStatuses: status => (status ? SQL`status = ANY(${status})` : SQL`1 = 1`)
})
