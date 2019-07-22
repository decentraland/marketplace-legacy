import { Approval } from './Approval.model'
import { APPROVAL_TYPES } from '../shared/approval'
import { ASSET_TYPES, getContractAddressByAssetType } from '../shared/asset'
import { SQL, raw } from '../database'

export const ApprovalQueries = Object.freeze({
  selectAssetApprovals: (assetType, tableName = 'assets') =>
    // prettier-ignore
    SQL`(${ApprovalQueries.selectApprovalByType(assetType, APPROVAL_TYPES.manager, tableName)}) as update_managers,
    (${ApprovalQueries.selectApprovalByType(assetType, APPROVAL_TYPES.operator, tableName)}) as operators_for_all`,

  selectApprovalByType: (assetType, approvalType, tableName = 'assets') =>
    SQL`
      SELECT array(
        SELECT operator
          FROM ${raw(Approval.tableName)} a
          WHERE a.owner = ${raw(tableName)}.owner
          AND a.type = ${approvalType}
          AND a.token_address = ${getContractAddressByAssetType(assetType)}
      )`
})
