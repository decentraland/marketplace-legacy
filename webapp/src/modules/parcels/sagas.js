import { takeEvery, select, call, put } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { eth, contracts } from 'decentraland-eth'
import {
  FETCH_PARCEL_REQUEST,
  EDIT_PARCEL_REQUEST,
  MANAGE_PARCEL_REQUEST,
  fetchParcelSuccess,
  fetchParcelFailure,
  editParcelSuccess,
  editParcelFailure,
  manageParcelSuccess,
  manageParcelFailure
} from './actions'
import { getData as getParcels } from './selectors'
import { locations } from 'locations'
import { api } from 'lib/api'
import { buildCoordinate } from 'shared/parcel'

export function* parcelsSaga() {
  yield takeEvery(FETCH_PARCEL_REQUEST, handleParcelRequest)
  yield takeEvery(EDIT_PARCEL_REQUEST, handleEditParcelsRequest)
  yield takeEvery(MANAGE_PARCEL_REQUEST, handleManageParcelsRequest)
}

function* handleParcelRequest(action) {
  const { x, y } = action
  try {
    const parcel = yield call(() => api.fetchParcel(x, y))

    yield put(fetchParcelSuccess(x, y, parcel))
  } catch (error) {
    console.warn(error)
    yield put(fetchParcelFailure(x, y, error.message))
  }
}

function* handleEditParcelsRequest(action) {
  try {
    const parcel = action.parcel
    const { x, y, data } = parcel

    const contract = eth.getContract('LANDRegistry')
    const dataString = contracts.LANDRegistry.encodeLandData(data)
    const txHash = yield call(() => contract.updateLandData(x, y, dataString))

    yield put(editParcelSuccess(txHash, parcel))
    yield put(push(locations.activity))
  } catch (error) {
    const parcels = yield select(getParcels)
    const { x, y } = action.parcel
    const parcel = parcels[buildCoordinate(x, y)]
    yield put(editParcelFailure(parcel, error.message))
  }
}

function* handleManageParcelsRequest(action) {
  const { x, y } = action.parcel
  try {
    const { parcel, address, revoked } = action

    const contract = eth.getContract('LANDRegistry')
    // @cazala TODO: this line should be removed once the method setUpdateOperator accepts x,y instead of assetId
    const assetId = yield call(() => contract.encodeTokenId(x, y))
    const txHash = yield call(() =>
      contract.setUpdateOperator(assetId, revoked ? null : address)
    )

    yield put(manageParcelSuccess(txHash, parcel, address, revoked))
    yield put(push(locations.activity))
  } catch (error) {
    const parcels = yield select(getParcels)
    const parcel = parcels[buildCoordinate(x, y)]
    yield put(
      manageParcelFailure(parcel, action.address, action.revoked, error.message)
    )
  }
}
