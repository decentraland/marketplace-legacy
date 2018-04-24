import { call, select, takeLatest, put } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { eth } from 'decentraland-eth'
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

    yield put(push(locations.activity))
    yield put(transferParcelSuccess(txHash, transfer))
  } catch (error) {
    yield put(transferParcelFailure(error.message))
  }
}
