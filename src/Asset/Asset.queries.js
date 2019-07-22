import { APPROVAL_TYPES } from '../shared/approval'
import { SQL, raw } from '../database'

export const AssetQueries = Object.freeze({
  canManageAsset: (owner, tableName = 'assets') =>
    SQL`(
      ${raw(tableName)}.owner = ${owner}
        OR ${raw(tableName)}.operator = ${owner}
        OR EXISTS (
          SELECT 1
            FROM approvals a
            WHERE a.owner = ${raw(tableName)}.owner
              AND a.operator = ${owner}
              AND a.type = ANY(${Object.values(APPROVAL_TYPES)})
            LIMIT 1
        )
    )`
})
