import { call, select, takeLatest, put } from 'redux-saga/effects'
import { eth, utils } from 'decentraland-commons'
import { getAddress } from 'modules/wallet/reducer'
import { FETCH_ADDRESS_PARCELS_REQUEST } from 'modules/address/actions'
import {
  TRANSFER_PARCEL_REQUEST,
  TRANSFER_PARCEL_SUCCESS,
  TRANSFER_PARCEL_FAILURE
} from './actions'

export default function* saga() {
  yield takeLatest(TRANSFER_PARCEL_REQUEST, handleTransferRequest)
  yield takeLatest(TRANSFER_PARCEL_SUCCESS, handleTransferSuccess)
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

    yield call(() => utils.sleep(2000))

    yield put({
      type: TRANSFER_PARCEL_SUCCESS,
      transfer: { hash, oldOwner, newOwner }
    })
  } catch (error) {
    yield put({ type: TRANSFER_PARCEL_FAILURE, error: error.message })
  }
}

function* handleTransferSuccess(action) {
  const { oldOwner } = action.transfer
  yield put({ type: FETCH_ADDRESS_PARCELS_REQUEST, address: oldOwner })
}
