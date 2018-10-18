import { buildTransactionAction } from 'modules/transaction/utils'

// Manage Parcel
export const MANAGE_ASSET_REQUEST = '[Request] Manage Asset'
export const MANAGE_ASSET_SUCCESS = '[Success] Manage Asset'
export const MANAGE_ASSET_FAILURE = '[Failure] Manage Asset'

export function manageAssetRequest(asset, asset_type, address, revoked) {
  return {
    type: MANAGE_ASSET_REQUEST,
    asset,
    asset_type,
    address,
    revoked
  }
}

export function manageAssetSuccess(
  txHash,
  asset,
  asset_type,
  address,
  revoked
) {
  return {
    type: MANAGE_ASSET_SUCCESS,
    ...buildTransactionAction(txHash, {
      ...asset,
      type: asset_type,
      address,
      revoked
    }),
    asset,
    asset_type,
    address,
    revoked
  }
}

export function manageAssetFailure(asset, asset_type, address, revoked, error) {
  return {
    type: MANAGE_ASSET_FAILURE,
    asset,
    asset_type,
    address,
    revoked,
    error
  }
}
