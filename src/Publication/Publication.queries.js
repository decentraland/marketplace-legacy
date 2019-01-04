import { Publication } from './Publication.model'
import { Parcel } from '../Asset'
import { SQL, raw } from '../database'
import { ASSET_TYPES } from '../../shared/asset'

export const PublicationQueries = Object.freeze({
  isActive: () => SQL`expires_at >= EXTRACT(epoch from now()) * 1000`,
  isInactive: () => SQL`expires_at < EXTRACT(epoch from now()) * 1000`,

  // These two, `hasAssetType` and `hasStatus`, can be abstracted into one method
  // but for now, they're accidental repetition. No need to overcomplicate things.
  hasAssetType: asset_type =>
    asset_type ? SQL`asset_type = ${asset_type}` : SQL`1 = 1`,
  hasStatus: status => (status ? SQL`status = ${status}` : SQL`1 = 1`),

  // prettier-ignore
  estateHasParcels: () =>
    SQL`(pub.asset_type = ${ASSET_TYPES.estate}
      AND EXISTS(SELECT 1 FROM ${raw(Parcel.tableName)} AS p WHERE p.estate_id = pub.asset_id)
      OR pub.asset_type != ${ASSET_TYPES.estate})`,

  findByStatusSql: (status = null) => {
    if (!Publication.isValidStatus(status)) {
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
