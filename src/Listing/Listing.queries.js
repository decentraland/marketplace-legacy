import { Listing } from './Listing'
import { SQL, raw } from '../database'

export const ListingQueries = Object.freeze({
  isInactive: () => SQL`expires_at < EXTRACT(epoch from now()) * 1000`,
  hasStatus: status => (status ? SQL`status = ${status}` : SQL`1 = 1`),
  hasStatuses: status => (status ? SQL`status = ANY(${status})` : SQL`1 = 1`),

  selectListableAssets: () => {
    const selectSQL = Listing.getListableAssets()
      .map(({ tableName }) => `row_to_json(${tableName}.*) as ${tableName}`)
      .join(', ')

    return raw(selectSQL)
  },

  /**
   * WARN: `joinTableName` is used as a raw param on the query
   * DO NOT use it for user submitted content
   */
  joinListableAssets: joinTableName => {
    const joinSQL = Listing.getListableAssets()
      .map(
        ({ tableName }) =>
          `LEFT JOIN ${tableName} as ${tableName} ON ${tableName}.id = ${joinTableName}.asset_id`
      )
      .join('\n')

    return raw(joinSQL)
  }
})
