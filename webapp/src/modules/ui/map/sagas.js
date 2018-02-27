import { takeEvery, put } from 'redux-saga/effects'
import { CHANGE_RANGE } from './actions'
import { fetchParcelsRequest } from 'modules/parcels/actions'

export function* mapSaga() {
  yield takeEvery(CHANGE_RANGE, handleChangeRange)
}

function* handleChangeRange(action) {
  const { nw, se } = action
  yield put(fetchParcelsRequest(nw, se))
}
