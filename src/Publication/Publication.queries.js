import { Publication } from './Publication.model'
import { Parcel } from '../Asset'
import { SQL, raw } from '../database'
import { ASSET_TYPES } from '../../shared/asset'

export const PublicationQueries = Object.freeze({
  whereIsActive: () => SQL`expires_at >= EXTRACT(epoch from now()) * 1000`,

  // These two, `hasAssetType` and `hasStatus`, can be abstracted into one method
  // but for now, they're accidental repetition. No need to overcomplicate things.
  hasAssetType: asset_type =>
    asset_type != null ? SQL`asset_type = ${asset_type}` : SQL`1 = 1`,
  hasStatus: status => (status != null ? SQL`status = ${status}` : SQL`1 = 1`),
  EstateHasParcels: () =>
    SQL`(pub.asset_type = ${ASSET_TYPES.estate} AND EXISTS(select 1 from ${raw(
      Parcel.tableName
    )} as p where p.estate_id = pub.asset_id) OR pub.asset_type != ${
      ASSET_TYPES.estate
    })`,

  findByStatusSql: (status = null) => {
    if (!Publication.isValidStatus(status)) {
      throw new Error(`Invalid status '${status}'`)
    }

    return SQL`SELECT *
      FROM ${raw(Publication.tableName)}
      WHERE status = ${status}
        AND ${PublicationQueries.whereIsActive()}
      ORDER BY created_at DESC`
  },

  findLastAssetPublicationJsonSql: assetTableName =>
    SQL`SELECT row_to_json(pub.*)
      FROM ${raw(Publication.tableName)} as pub
      WHERE ${raw(assetTableName)}.id = pub.asset_id
        AND ${PublicationQueries.whereIsActive()}
      ORDER BY pub.created_at DESC
      LIMIT 1`
})
