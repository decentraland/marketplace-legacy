import { select, takeEvery, call, put, all } from 'redux-saga/effects'

import { LISTING_STATUS } from 'shared/listing'
import { getAssetPublications, ASSET_TYPES } from 'shared/asset'
import {
  FETCH_ADDRESS,
  FETCH_ADDRESS_PARCELS_REQUEST,
  FETCH_ADDRESS_CONTRIBUTIONS_REQUEST,
  FETCH_ADDRESS_PUBLICATIONS_REQUEST,
  FETCH_ADDRESS_ESTATES_REQUEST,
  FETCH_ADDRESS_BIDS_REQUEST,
  fetchAddressParcelsRequest,
  fetchAddressParcelsSuccess,
  fetchAddressParcelsFailure,
  fetchAddressContributionsRequest,
  fetchAddressContributionsSuccess,
  fetchAddressContributionsFailure,
  fetchAddressPublicationsRequest,
  fetchAddressPublicationsSuccess,
  fetchAddressPublicationsFailure,
  fetchAddressEstatesSuccess,
  fetchAddressEstatesFailure,
  fetchAddressEstatesRequest,
  fetchAddressBidsRequest,
  fetchAddressBidsSuccess,
  fetchAddressBidsFailure
} from './actions'
import { fetchMortgagedParcelsRequest } from 'modules/mortgage/actions'
import { getData as getParcels } from 'modules/parcels/selectors'
import { api } from 'lib/api'
import { webworker } from 'lib/webworker'

export function* addressSaga() {
  yield takeEvery(FETCH_ADDRESS_PARCELS_REQUEST, handleAddressParcelsRequest)
  yield takeEvery(
    FETCH_ADDRESS_CONTRIBUTIONS_REQUEST,
    handleAddressContributionsRequest
  )
  yield takeEvery(
    FETCH_ADDRESS_PUBLICATIONS_REQUEST,
    handleAddressPublicationsRequest
  )
  yield takeEvery(FETCH_ADDRESS_ESTATES_REQUEST, handleAddressEstatesRequest)
  yield takeEvery(FETCH_ADDRESS_BIDS_REQUEST, handleAddressBidsRequest)

  yield takeEvery(FETCH_ADDRESS, handleFetchAddress)
}

function* handleAddressParcelsRequest(action) {
  const { address } = action
  try {
    const parcels = yield call(() => api.fetchAddressParcels(address))
    const allParcels = yield select(getParcels)

    const result = yield call(() =>
      webworker.postMessage({
        type: 'FETCH_ADDRESS_PARCELS_REQUEST',
        parcels,
        allParcels
      })
    )

    yield put(
      fetchAddressParcelsSuccess(address, result.parcels, result.publications)
    )
  } catch (error) {
    yield put(fetchAddressParcelsFailure(address, error.message))
  }
}

function* handleAddressEstatesRequest(action) {
  const { address } = action
  try {
    const estates = yield call(() => api.fetchAddressEstates(address))

    const result = yield call(() =>
      webworker.postMessage({
        type: 'FETCH_ADDRESS_ESTATES_REQUEST',
        estates
      })
    )
    yield put(
      fetchAddressEstatesSuccess(address, result.estates, result.publications)
    )
  } catch (error) {
    yield put(fetchAddressEstatesFailure(address, error.message))
  }
}

function* handleAddressContributionsRequest(action) {
  const { address } = action
  try {
    const contributions = yield call(() =>
      api.fetchAddressContributions(address)
    )
    yield put(fetchAddressContributionsSuccess(address, contributions))
  } catch (error) {
    yield put(fetchAddressContributionsFailure(address, error.message))
  }
}

function* handleAddressPublicationsRequest(action) {
  const { address, status } = action
  try {
    //@nacho TODO: provisory code. We need an endpoint to get all asset with open publications
    const parcels = yield call(() => api.fetchAddressParcels(address, status))
    const estates = yield call(() => api.fetchAddressEstates(address, status))
    const parcelPublications = getAssetPublications(parcels)
    const estatePublications = getAssetPublications(estates)

    const assets = [...parcels, ...estates]
    const publications = [...parcelPublications, ...estatePublications]
    yield put(fetchAddressPublicationsSuccess(address, assets, publications))
  } catch (error) {
    yield put(fetchAddressPublicationsFailure(address, error.message))
  }
}

function* handleAddressBidsRequest(action) {
  const { address, status } = action
  try {
    const [bids, assets] = yield all([
      call(() => api.fetchAddressBids(address, status)),
      call(() => api.fetchBidAssets(address, status))
    ])

    // We need to filter bids for empty estates.
    // api.fetchBidAssets(address, status)) will return only estates with parcels
    const sanitizedBids = bids.filter(
      bid =>
        bid.asset_type === ASSET_TYPES.parcel ||
        assets.some(asset => asset.token_id === bid.asset_id)
    )

    yield put(fetchAddressBidsSuccess(address, sanitizedBids, assets))
  } catch (error) {
    yield put(fetchAddressBidsFailure(address, error.message))
  }
}

function* handleFetchAddress(action) {
  const { address } = action

  yield put(fetchAddressParcelsRequest(address))
  yield put(fetchAddressEstatesRequest(address))
  yield put(fetchAddressPublicationsRequest(address, LISTING_STATUS.open))
  yield put(fetchAddressContributionsRequest(address))
  yield put(fetchMortgagedParcelsRequest(address))
  yield put(fetchAddressBidsRequest(address, LISTING_STATUS.open))
}
