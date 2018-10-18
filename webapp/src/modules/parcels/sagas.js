import { takeEvery, select, call, put } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { eth, contracts } from 'decentraland-eth'
import { locations } from 'locations'
import {
  FETCH_PARCEL_REQUEST,
  EDIT_PARCEL_REQUEST,
  TRANSFER_PARCEL_REQUEST,
  fetchParcelSuccess,
  fetchParcelFailure,
  editParcelSuccess,
  editParcelFailure,
  transferParcelSuccess,
  transferParcelFailure
} from './actions'
import { getData as getParcels } from './selectors'
import { getAddress } from 'modules/wallet/selectors'
import { api } from 'lib/api'
import { buildCoordinate } from 'shared/parcel'

export function* parcelsSaga() {
  yield takeEvery(FETCH_PARCEL_REQUEST, handleParcelRequest)
  yield takeEvery(EDIT_PARCEL_REQUEST, handleEditParcelsRequest)
  yield takeEvery(TRANSFER_PARCEL_REQUEST, handleTransferRequest)
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
    yield put(push(locations.activity()))
  } catch (error) {
    const parcels = yield select(getParcels)
    const { x, y } = action.parcel
    const parcel = parcels[buildCoordinate(x, y)]
    yield put(editParcelFailure(parcel, error.message))
  }
}

function* handleTransferRequest(action) {
  try {
    const oldOwner = yield select(getAddress)
    const newOwner = action.address
    const parcel = { ...action.parcel }

    if (oldOwner.toLowerCase() === newOwner.toLowerCase()) {
      throw new Error("You can't transfer parcels to yourself")
    }

    if (!eth.utils.isValidAddress(newOwner)) {
      throw new Error('Invalid Ethereum address')
    }

    if (!parcel) {
      throw new Error('Invalid parcel')
    }

    const contract = eth.getContract('LANDRegistry')
    const txHash = yield call(() =>
      contract.transferLand(parcel.x, parcel.y, newOwner)
    )

    const transfer = {
      txHash,
      oldOwner,
      newOwner,
      parcelId: parcel.id,
      x: parcel.x,
      y: parcel.y
    }

    yield put(push(locations.activity()))
    yield put(transferParcelSuccess(txHash, transfer))
  } catch (error) {
    yield put(transferParcelFailure(error.message))
  }
}
