import { delay } from 'redux-saga'
import { call, select, takeLatest, put } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { eth } from 'decentraland-commons'
import {
  TRANSFER_PARCEL_REQUEST,
  transferParcelSuccess,
  transferParcelFailure
} from './actions'
import { locations } from 'locations'
import { getAddress } from 'modules/wallet/selectors'

export function* transferSaga() {
  yield takeLatest(TRANSFER_PARCEL_REQUEST, handleTransferRequest)
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
    const txHash = yield call(() => contract.transferLand(parcel.x, parcel.y, newOwner))

    const transfer = { oldOwner, newOwner, parcel }
    yield put(transferParcelSuccess(txHash, transfer))
    yield put(push(locations.activity))
  } catch (error) {
    // "Recommended" way to check for rejections
    // https://github.com/MetaMask/faq/issues/6#issuecomment-264900031
    const message = error.message.includes('User denied transaction signature')
      ? 'Transaction rejected'
      : error.message

    yield put(transferParcelFailure(message))
  }
}
