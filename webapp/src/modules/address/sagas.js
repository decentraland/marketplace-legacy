import { takeEvery, call, put } from 'redux-saga/effects'
import {
  FETCH_ADDRESS,
  FETCH_ADDRESS_PARCELS_REQUEST,
  FETCH_ADDRESS_CONTRIBUTIONS_REQUEST,
  FETCH_ADDRESS_PUBLICATIONS_REQUEST,
  fetchAddressParcelsRequest,
  fetchAddressParcelsSuccess,
  fetchAddressParcelsFailure,
  fetchAddressContributionsRequest,
  fetchAddressContributionsSuccess,
  fetchAddressContributionsFailure,
  fetchAddressPublicationsRequest,
  fetchAddressPublicationsSuccess,
  fetchAddressPublicationsFailure
} from './actions'
import { api } from 'lib/api'

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
  yield takeEvery(FETCH_ADDRESS, handleFetchAddress)
}

function* handleAddressParcelsRequest(action) {
  const { address } = action
  try {
    const parcels = yield call(() => api.fetchAddressParcels(address))
    yield put(fetchAddressParcelsSuccess(address, parcels))
  } catch (error) {
    yield put(fetchAddressParcelsFailure(address, error.message))
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
  const { address } = action
  try {
    const publications = yield call(() => api.fetchAddressPublications(address))
    yield put(fetchAddressPublicationsSuccess(address, publications))
  } catch (error) {
    yield put(fetchAddressPublicationsFailure(address, error.message))
  }
}

function* handleFetchAddress(action) {
  const { address } = action
  yield put(fetchAddressParcelsRequest(address))
  yield put(fetchAddressPublicationsRequest(address)) // ⚡
  yield put(fetchAddressContributionsRequest(address))
}
