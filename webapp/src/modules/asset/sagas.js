import { takeEvery, take, put } from 'redux-saga/effects'
import { push } from 'react-router-redux'

import { locations } from 'locations'
import { FETCH_ASSET } from './actions'
import {
  FETCH_PARCEL_SUCCESS,
  fetchParcelRequest
} from 'modules/parcels/actions'
import {
  FETCH_ESTATE_SUCCESS,
  fetchEstateRequest
} from 'modules/estates/actions'
import { ASSET_TYPES } from 'shared/asset'

export function* assetSaga() {
  yield takeEvery(FETCH_ASSET, handleFetchAsset)
}

function* handleFetchAsset(action) {
  const { asset, assetType } = action

  switch (assetType) {
    case ASSET_TYPES.parcel: {
      yield put(fetchParcelRequest(asset.x, asset.y))
      const { x, y } = yield take(FETCH_PARCEL_SUCCESS)
      yield put(push(locations.parcelDetail(x, y)))
      break
    }
    case ASSET_TYPES.estate: {
      yield put(fetchEstateRequest(asset.id))
      const { estate } = yield take(FETCH_ESTATE_SUCCESS)
      yield put(push(locations.estateDetail(estate.id)))
      break
    }
    default:
      throw new Error(`Unkown asset type ${action.assetType}`)
  }
}
