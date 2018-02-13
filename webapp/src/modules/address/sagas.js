import { takeEvery, call, put } from 'redux-saga/effects'
import {
  FETCH_ADDRESS_PARCELS_REQUEST,
  FETCH_ADDRESS_CONTRIBUTIONS_REQUEST,
  FETCH_ADDRESS_PUBLICATIONS_REQUEST,
  fetchAddressParcelsSuccess,
  fetchAddressParcelsFailure,
  fetchAddressContributionsSuccess,
  fetchAddressContributionsFailure,
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
