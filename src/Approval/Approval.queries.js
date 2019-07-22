import { Approval } from './Approval.model'
import { APPROVAL_TYPES } from '../shared/approval'
import { SQL, raw } from '../database'

export const ApprovalQueries = Object.freeze({
  selectAssetApprovals: (tableName = 'assets') =>
    // prettier-ignore
    SQL`(${ApprovalQueries.selectApprovalByType(APPROVAL_TYPES.manager, tableName)}) as update_managers,
    (${ApprovalQueries.selectApprovalByType(APPROVAL_TYPES.operator, tableName)}) as operators_for_all`,

  selectApprovalByType: (approvalType, tableName = 'assets') =>
    SQL`
      SELECT array(
        SELECT operator
          FROM ${raw(Approval.tableName)} a
          WHERE a.owner = ${raw(tableName)}.owner
          AND a.type = ${approvalType}
      )`
})
