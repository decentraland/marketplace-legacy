import { takeEvery, take, put } from 'redux-saga/effects'
import { push } from 'react-router-redux'

import { locations } from 'locations'
import { FETCH_ASSET, FETCH_ASSET_LISTING_HISTORY } from './actions'
import {
  FETCH_PARCEL_SUCCESS,
  fetchParcelRequest
} from 'modules/parcels/actions'
import {
  FETCH_ESTATE_SUCCESS,
  fetchEstateRequest
} from 'modules/estates/actions'
import { fetchAssetAcceptedBidsRequest } from 'modules/bid/actions'
import { ASSET_TYPES } from 'shared/asset'

export function* assetSaga() {
  yield takeEvery(FETCH_ASSET, handleFetchAsset)
  yield takeEvery(FETCH_ASSET_LISTING_HISTORY, handleFetchAssetListingHistory)
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

function* handleFetchAssetListingHistory({ asset }) {
  // @TODO: fetch publications (?) and mortgages
  yield put(fetchAssetAcceptedBidsRequest(asset))
}
