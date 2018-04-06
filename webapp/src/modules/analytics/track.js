import { buildCoordinate } from 'lib/utils'
import { add } from './utils'
import {
  BUY_SUCCESS,
  PUBLISH_SUCCESS,
  CANCEL_SALE_SUCCESS
} from 'modules/publication/actions'
import { TRANSFER_PARCEL_SUCCESS } from 'modules/transfer/actions'
import { EDIT_PARCEL_SUCCESS } from 'modules/parcels/actions'
import {
  APPROVE_MANA_SUCCESS,
  AUTHORIZE_LAND_SUCCESS,
  TRANSFER_MANA_SUCCESS
} from 'modules/wallet/actions'
import { FETCH_TRANSACTION_FAILURE } from 'modules/transaction/actions'

add(BUY_SUCCESS, 'Buy', action => ({
  assetId: buildCoordinate(action.publication.x, action.publication.y),
  x: action.publication.x,
  y: action.publication.y,
  price: action.publication.price,
  seller: action.publication.owner
}))

add(PUBLISH_SUCCESS, 'Publish', action => ({
  assetId: buildCoordinate(action.publication.x, action.publication.y),
  x: action.publication.x,
  y: action.publication.y,
  price: action.publication.price
}))

add(CANCEL_SALE_SUCCESS, 'Cancel Sale', action => ({
  assetId: buildCoordinate(action.publication.x, action.publication.y),
  x: action.publication.x,
  y: action.publication.y,
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

add(
  FETCH_TRANSACTION_FAILURE,
  'Transaction Failed',
  action => action.transaction
)
