import { txUtils } from 'decentraland-eth'

import { FETCH_TRANSACTION_FAILURE } from '@dapps/modules/transaction/actions'
import { add } from '@dapps/modules/analytics/utils'
import {
  BUY_SUCCESS,
  PUBLISH_SUCCESS,
  CANCEL_SALE_SUCCESS
} from 'modules/publication/actions'
import {
  EDIT_PARCEL_SUCCESS,
  TRANSFER_PARCEL_SUCCESS
} from 'modules/parcels/actions'
import {
  ALLOW_TOKEN_SUCCESS,
  APPROVE_TOKEN_SUCCESS
} from 'modules/authorization/actions'
import { TRANSFER_MANA_SUCCESS, BUY_MANA_SUCCESS } from 'modules/wallet/actions'
import {
  CREATE_ESTATE_SUCCESS,
  EDIT_ESTATE_METADATA_SUCCESS,
  EDIT_ESTATE_PARCELS_SUCCESS,
  DELETE_ESTATE_SUCCESS,
  TRANSFER_ESTATE_SUCCESS
} from 'modules/estates/actions'
import { MANAGE_ASSET_SUCCESS } from 'modules/management/actions'

const addAssetType = (actionName, assetType) =>
  `${actionName} ${assetType[0].toUpperCase() + assetType.slice(1)}`

export function track() {
  add(
    BUY_SUCCESS,
    action => addAssetType('Buy', action.publication.asset_type),
    action => ({
      assetId: action.publication.asset_id,
      price: action.publication.price,
      seller: action.publication.owner
    })
  )

  add(
    PUBLISH_SUCCESS,
    action => addAssetType('Publish', action.publication.asset_type),
    action => ({
      assetId: action.publication.asset_id,
      price: action.publication.price
    })
  )

  add(
    CANCEL_SALE_SUCCESS,
    action => addAssetType('Cancel Sale', action.publication.asset_type),
    action => ({
      assetId: action.publication.asset_id,
      price: action.publication.price
    })
  )

  add(TRANSFER_PARCEL_SUCCESS, 'Transfer Parcel', action => ({
    assetId: action.transfer.parcelId,
    x: action.transfer.x,
    y: action.transfer.y,
    to: action.transfer.newOwner
  }))

  add(EDIT_PARCEL_SUCCESS, 'Edit Parcel', action => ({
    assetId: action.parcel.id,
    x: action.parcel.x,
    y: action.parcel.y,
    name: action.parcel.data.name,
    description: action.parcel.data.description
  }))

  add(
    ALLOW_TOKEN_SUCCESS,
    ({ payload }) =>
      payload.amount > 0
        ? `Authorize ${payload.contractName} for ${payload.tokenContractName}`
        : `Unauthorize ${payload.contractName} for ${payload.tokenContractName}`
  )

  add(
    APPROVE_TOKEN_SUCCESS,
    ({ payload }) =>
      payload.isApproved
        ? `Authorize ${payload.contractName} for ${payload.tokenContractName}`
        : `Unauthorize ${payload.contractName} for ${payload.tokenContractName}`
  )

  add(TRANSFER_MANA_SUCCESS, 'Transfer MANA', action => ({
    mana: action.mana,
    address: action.address
  }))

  add(BUY_MANA_SUCCESS, 'Buy MANA', action => ({
    mana: action.mana
  }))

  add(
    FETCH_TRANSACTION_FAILURE,
    action =>
      action.payload.status === txUtils.TRANSACTION_TYPES.reverted
        ? 'Transaction Failed'
        : 'Transaction Dropped',
    action => action.payload
  )

  add(
    MANAGE_ASSET_SUCCESS,
    action => addAssetType('Manage Permissions for', action.asset_type),
    action => ({
      asset_id: action.asset_id,
      address: action.address,
      revoked: action.revoked
    })
  )

  add(CREATE_ESTATE_SUCCESS, 'Create Estate', action => ({
    parcels: action.estate.data.parcels.map(p => `(${p.x}, ${p.y})`).join(', '),
    address: action.owner
  }))

  add(EDIT_ESTATE_METADATA_SUCCESS, 'Edit Estate Metadata', action => ({
    token_id: action.estate.id,
    name: action.estate.data.name,
    description: action.estate.data.description,
    address: action.estate.owner
  }))

  add(EDIT_ESTATE_PARCELS_SUCCESS, 'Edit Estate Parcels', action => ({
    token_id: action.estate.id,
    parcels: action.parcels.map(p => `(${p.x}, ${p.y})`).join(', '),
    type: action.actionType,
    address: action.estate.owner
  }))

  add(DELETE_ESTATE_SUCCESS, 'Delete Estate', action => ({
    token_id: action.estate.id,
    address: action.estate.owner
  }))

  add(TRANSFER_ESTATE_SUCCESS, 'Transfer Estate', action => ({
    token_id: action.transfer.estate.id,
    to: action.transfer.to
  }))
}
