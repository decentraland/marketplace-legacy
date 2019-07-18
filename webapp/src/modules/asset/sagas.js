import { takeEvery, take, put, call, select } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { eth } from 'decentraland-eth'

import { locations } from 'locations'
import {
  FETCH_ASSET_REQUEST,
  NAVIGATE_TO_ASSET,
  FETCH_ASSET_LISTING_HISTORY,
  fetchAssetSuccess,
  fetchAssetFailure
} from './actions'
import { ASSET_TYPES } from 'shared/asset'
import { splitCoordinate } from 'shared/coordinates'
import {
  FETCH_PARCEL_SUCCESS,
  fetchParcelRequest
} from 'modules/parcels/actions'
import {
  FETCH_ESTATE_SUCCESS,
  fetchEstateRequest
} from 'modules/estates/actions'
import { fetchAssetAcceptedBidsRequest } from 'modules/bid/actions'
import { getData as getEstates } from 'modules/estates/selectors'

export function* assetSaga() {
  yield takeEvery(FETCH_ASSET_REQUEST, handleFetchAsset)
  yield takeEvery(NAVIGATE_TO_ASSET, handleNavigateToAsset)
  yield takeEvery(FETCH_ASSET_LISTING_HISTORY, handleFetchAssetListingHistory)
}

function* handleFetchAsset(action) {
  const { assetId, assetType } = action

  try {
    const asset = yield fetchAsset(assetId, assetType)
    yield put(fetchAssetSuccess(asset, assetType))
  } catch (error) {
    yield put(fetchAssetFailure(assetId, assetType, error.message))
  }
}

function* handleNavigateToAsset(action) {
  const { assetId, assetType } = action

  yield fetchAsset(assetId, assetType) // fill state
  yield put(push(locations.assetDetail(assetId, assetType)))
}

function* handleFetchAssetListingHistory(action) {
  const { asset, assetType } = action
  // TODO: fetch publications (?) and mortgages
  yield put(fetchAssetAcceptedBidsRequest(asset, assetType))
}

export function* fetchAsset(assetId, assetType) {
  // TODO: Check for _FAILURE cases
  switch (assetType) {
    case ASSET_TYPES.parcel: {
      const [x, y] = splitCoordinate(assetId)
      yield put(fetchParcelRequest(x, y))
      return yield take(FETCH_PARCEL_SUCCESS)
    }
    case ASSET_TYPES.estate: {
      yield put(fetchEstateRequest(assetId))
      return yield take(FETCH_ESTATE_SUCCESS)
    }
    default:
      throw new Error(`Invalid asset type "${assetType}"`)
  }
}

export function* buildAsset(assetId, assetType) {
  let asset

  if (assetType === ASSET_TYPES.parcel) {
    const [x, y] = splitCoordinate(assetId)

    const landRegistry = eth.getContract('LANDRegistry')
    const tokenId = yield call(() => landRegistry.encodeTokenId(x, y))

    asset = {
      id: tokenId.toString(),
      x: parseInt(x, 10),
      y: parseInt(y, 10)
    }
  } else if (assetType === ASSET_TYPES.estate) {
    const estates = yield select(getEstates)
    const estate = estates[assetId]

    asset = {
      id: assetId,
      data: {
        name: estate.data.name,
        parcels: estate.data.parcels
      }
    }
  }

  return { ...asset, type: assetType }
}
