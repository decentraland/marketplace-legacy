import { Publication } from './Publication.model'
import { Parcel } from '../Parcel'
import { SQL, raw } from '../database'

export const PublicationQueries = Object.freeze({
  whereisActive: () => SQL`expires_at >= EXTRACT(epoch from now()) * 1000`,

  findByStatusSql: (status = null) => {
    if (!Publication.isValidStatus(status)) {
      throw new Error(`Invalid status '${status}'`)
    }

    return SQL`SELECT *
      FROM ${raw(Publication.tableName)}
      WHERE status = ${status}
        AND ${PublicationQueries.whereisActive()}
      ORDER BY created_at DESC`
  },

  findLastAssetPublicationJsonSql: assetTableName =>
    SQL`SELECT row_to_json(pub.*)
      FROM ${raw(Publication.tableName)} as pub
      WHERE ${raw(assetTableName)}.id = pub.asset_id
        AND ${PublicationQueries.whereisActive()}
      ORDER BY pub.created_at DESC
      LIMIT 1`
})
