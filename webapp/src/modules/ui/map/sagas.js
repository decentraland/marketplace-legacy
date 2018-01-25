import { takeEvery, put } from 'redux-saga/effects'
import { FETCH_PARCELS_REQUEST } from 'modules/parcels/actions'
import { CHANGE_RANGE } from './actions'

export default function* saga() {
  yield takeEvery(CHANGE_RANGE, handleChangeRange)
}

function* handleChangeRange(action) {
  const { nw, se } = action
  yield put({
    type: FETCH_PARCELS_REQUEST,
    nw,
    se
  })
}
