import { select, takeEvery, call, put } from 'redux-saga/effects'

import { isFeatureEnabled } from 'lib/featureUtils'
import {
  FETCH_ADDRESS,
  FETCH_ADDRESS_PARCELS_REQUEST,
  FETCH_ADDRESS_CONTRIBUTIONS_REQUEST,
  FETCH_ADDRESS_PUBLICATIONS_REQUEST,
  FETCH_ADDRESS_ESTATES_REQUEST,
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
  fetchAddressEstatesRequest
} from './actions'
import { fetchMortgagedParcelsRequest } from 'modules/mortgage/actions'
import { PUBLICATION_STATUS } from 'modules/publication/utils'
import { getParcelPublications } from 'modules/parcels/utils'
import { getParcels } from 'modules/parcels/selectors'
import { api } from 'lib/api'
import { webworker } from 'lib/webworker'
import { toEstateObject } from 'modules/estates/utils'

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
    const response = yield call(() => api.fetchAddressEstates(address))
    const estates = toEstateObject(response)

    yield put(fetchAddressEstatesSuccess(address, estates))
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
  yield put(fetchAddressEstatesRequest(address))
  if (isFeatureEnabled('MORTGAGES')) {
    // Mortgage Feature
    yield put(fetchMortgagedParcelsRequest(address))
  }
}
