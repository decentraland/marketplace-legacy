import { APPROVAL_TYPES } from '../shared/approval'
import { SQL, raw } from '../database'

export const AssetQueries = Object.freeze({
  canAccessAsset: (address, tableName = 'assets') =>
    SQL`(
      ${raw(tableName)}.owner = ${address}
        OR ${raw(tableName)}.operator = ${address}
        OR ${raw(tableName)}.update_operator = ${address}
        OR EXISTS (
          SELECT 1
            FROM approvals a
            WHERE a.owner = ${raw(tableName)}.owner
              AND a.operator = ${address}
              AND a.type = ANY(${Object.values(APPROVAL_TYPES)})
            LIMIT 1
        )
    )`
})
