import { Listing } from '../Listing'
import { Publication } from './Publication.model'
import { SQL, raw } from '../../database'

export const PublicationQueries = Object.freeze({
  isActive: () => SQL`expires_at >= EXTRACT(epoch from now()) * 1000`,

  // These two, `hasAssetType` and `hasStatus`, can be abstracted into one method
  // but for now, they're accidental repetition. No need to overcomplicate things.
  hasAssetType: asset_type =>
    asset_type ? SQL`asset_type = ${asset_type}` : SQL`1 = 1`,

  findByStatusSql: (status = null) => {
    if (!Listing.isValidStatus(status)) {
      throw new Error(`Invalid status '${status}'`)
    }

    return SQL`SELECT *
      FROM ${raw(Publication.tableName)}
      WHERE status = ${status}
        AND ${PublicationQueries.isActive()}
      ORDER BY created_at DESC`
  },

  findLastAssetPublicationJsonSql: assetTableName =>
    SQL`SELECT row_to_json(pub.*)
      FROM ${raw(Publication.tableName)} as pub
      WHERE ${raw(assetTableName)}.id = pub.asset_id
        AND ${PublicationQueries.isActive()}
      ORDER BY pub.created_at DESC
      LIMIT 1`
})
