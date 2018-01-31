import { call, select, takeLatest, put } from 'redux-saga/effects'
import { eth } from 'decentraland-commons'
import { getAddress } from 'modules/wallet/reducer'
import {
  TRANSFER_PARCEL_REQUEST,
  TRANSFER_PARCEL_SUCCESS,
  TRANSFER_PARCEL_FAILURE
} from './actions'

export function* transferSaga() {
  yield takeLatest(TRANSFER_PARCEL_REQUEST, handleTransferRequest)
}

function* handleTransferRequest(action) {
  try {
    const oldOwner = yield select(getAddress)
    const { x, y } = action.parcel
    const newOwner = action.address

    if (oldOwner.toLowerCase() === newOwner.toLowerCase()) {
      throw new Error("You can't transfer parcels to yourself")
    }
    if (!eth.utils.isValidAddress(newOwner)) {
      throw new Error('Invalid Ethereum address')
    }

    const contract = eth.getContract('LANDRegistry')
    const hash = yield call(() => contract.transferTo(x, y, newOwner))

    yield put({
      type: TRANSFER_PARCEL_SUCCESS,
      transfer: { hash, oldOwner, newOwner, x, y }
    })
  } catch (error) {
    yield put({ type: TRANSFER_PARCEL_FAILURE, error: error.message })
  }
}
