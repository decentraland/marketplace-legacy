import { takeEvery, put, call } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { eth } from 'decentraland-eth'

import {
  MANAGE_ASSET_REQUEST,
  manageAssetSuccess,
  manageAssetFailure
} from './actions'
import { ASSET_TYPES } from 'shared/asset'
import { locations } from 'locations'

export function* managementSaga() {
  yield takeEvery(MANAGE_ASSET_REQUEST, handleManageAssetRequest)
}

function* handleManageAssetRequest(action) {
  const { asset, asset_type, address, revoked } = action

  try {
    let contract
    let assetId
    let txAsset

    switch (asset_type) {
      case ASSET_TYPES.parcel: {
        const { x, y } = asset
        contract = eth.getContract('LANDRegistry')
        assetId = yield call(() => contract.encodeTokenId(x, y))
        txAsset = asset
        break
      }
      case ASSET_TYPES.estate: {
        contract = eth.getContract('EstateRegistry')
        assetId = asset.id
        txAsset = {
          id: asset.id,
          data: {
            name: asset.data.name,
            parcels: asset.data.parcels // array of {x, y}
          }
        }
        break
      }
      default:
        break
    }
    const txHash = yield call(() =>
      contract.setUpdateOperator(assetId, revoked ? null : address)
    )
    yield put(manageAssetSuccess(txHash, txAsset, asset_type, address, revoked))
    yield put(push(locations.activity()))
  } catch (error) {
    yield put(
      manageAssetFailure(
        asset,
        asset_type,
        action.address,
        action.revoked,
        error.message
      )
    )
  }
}
