import { add } from './utils'
import {
  BUY_SUCCESS,
  PUBLISH_SUCCESS,
  CANCEL_SALE_SUCCESS
} from 'modules/publication/actions'
import {
  EDIT_PARCEL_SUCCESS,
  MANAGE_PARCEL_SUCCESS,
  TRANSFER_PARCEL_SUCCESS
} from 'modules/parcels/actions'
import {
  APPROVE_MANA_SUCCESS,
  AUTHORIZE_LAND_SUCCESS,
  TRANSFER_MANA_SUCCESS,
  BUY_MANA_SUCCESS
} from 'modules/wallet/actions'
import { FETCH_TRANSACTION_FAILURE } from '@dapps/modules/transaction/actions'
import {
  CREATE_ESTATE_SUCCESS,
  EDIT_ESTATE_METADATA_SUCCESS,
  EDIT_ESTATE_PARCELS_SUCCESS,
  DELETE_ESTATE_SUCCESS
} from 'modules/estates/actions'
import { txUtils } from 'decentraland-eth'

add(BUY_SUCCESS, 'Buy', action => ({
  assetId: action.publication.asset_id,
  price: action.publication.price,
  seller: action.publication.owner
}))

add(PUBLISH_SUCCESS, 'Publish', action => ({
  assetId: action.publication.asset_id,
  price: action.publication.price
}))

add(CANCEL_SALE_SUCCESS, 'Cancel Sale', action => ({
  assetId: action.publication.asset_id,
  price: action.publication.price
}))

add(TRANSFER_PARCEL_SUCCESS, 'Transfer', action => ({
  assetId: action.transfer.parcelId,
  x: action.transfer.x,
  y: action.transfer.y,
  to: action.transfer.newOwner
}))

add(EDIT_PARCEL_SUCCESS, 'Edit', action => ({
  assetId: action.parcel.id,
  x: action.parcel.x,
  y: action.parcel.y,
  name: action.parcel.data.name,
  description: action.parcel.data.description
}))

add(
  APPROVE_MANA_SUCCESS,
  action => (action.mana > 0 ? 'Authorize MANA' : 'Unauthorize MANA')
)

add(
  AUTHORIZE_LAND_SUCCESS,
  action => (action.isAuthorized ? 'Authorize LAND' : 'Unauthorize LAND')
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

add(MANAGE_PARCEL_SUCCESS, 'Manage LAND Permissions', action => ({
  x: action.parcel.x,
  y: action.parcel.y,
  address: action.address,
  revoked: action.revoked
})),
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
