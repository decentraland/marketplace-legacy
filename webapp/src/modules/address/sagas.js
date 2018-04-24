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
import { PUBLICATION_STATUS } from 'modules/publication/utils'
import { getParcelPublications } from 'modules/parcels/utils'
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
  const { address, status } = action
  try {
    const parcels = yield call(() => api.fetchAddressParcels(address, status))
    const publications = getParcelPublications(parcels)
    yield put(fetchAddressPublicationsSuccess(address, parcels, publications))
  } catch (error) {
    yield put(fetchAddressPublicationsFailure(address, error.message))
  }
}

function* handleFetchAddress(action) {
  const { address } = action

  yield put(fetchAddressParcelsRequest(address))
  yield put(fetchAddressPublicationsRequest(address, PUBLICATION_STATUS.open))
  yield put(fetchAddressContributionsRequest(address))
}
