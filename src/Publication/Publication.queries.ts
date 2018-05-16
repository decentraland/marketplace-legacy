import { Publication } from './Publication.model'
import { Parcel } from '../Parcel'
import { SQL, raw, SQLStatement } from '../database'

export const PublicationQueries = Object.freeze({
  whereisActive: (): SQLStatement =>
    SQL`expires_at >= EXTRACT(epoch from now()) * 1000`,

  findByStatusSql: (status: string = null): SQLStatement => {
    if (!Publication.isValidStatus(status)) {
      throw new Error(`Invalid status '${status}'`)
    }

    return SQL`SELECT *
      FROM ${raw(Publication.tableName)}
      WHERE status = ${status}
        AND ${PublicationQueries.whereisActive()}
      ORDER BY created_at DESC`
  },

  findLastParcelPublicationJsonSql: (): SQLStatement =>
    SQL`SELECT row_to_json(pub.*)
      FROM ${raw(Publication.tableName)} as pub
      WHERE ${raw(Parcel.tableName)}.id = pub.asset_id
        AND ${PublicationQueries.whereisActive()}
      ORDER BY pub.created_at DESC
      LIMIT 1`
})
