import { takeLatest, put } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { CHANGE_LOCATION } from './actions'

export default function* saga() {
  yield takeLatest(CHANGE_LOCATION, handleLocationChange)
}

function* handleLocationChange(action) {
  yield put(push(action.url))
}
