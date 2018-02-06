import { takeEvery, call, put } from 'redux-saga/effects'
import {
  FETCH_ADDRESS_PARCELS_REQUEST,
  FETCH_ADDRESS_PARCELS_SUCCESS,
  FETCH_ADDRESS_CONTRIBUTIONS_REQUEST,
  fetchAddressParcelsSuccess,
  fetchAddressParcelsFailure,
  fetchAddressContributionsSuccess,
  fetchAddressContributionsFailure
} from './actions'
import { mergeParcels } from 'modules/parcels/actions'
import { api } from 'lib/api'

export function* addressSaga() {
  yield takeEvery(FETCH_ADDRESS_PARCELS_REQUEST, handleAddressParcelsRequest)
  yield takeEvery(FETCH_ADDRESS_PARCELS_SUCCESS, handleAddressParcelsSuccess)
  yield takeEvery(
    FETCH_ADDRESS_CONTRIBUTIONS_REQUEST,
    handleAddressContributionsRequest
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

function* handleAddressParcelsSuccess(action) {
  yield put(mergeParcels(action.parcels))
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
