import { takeLatest, put } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { NAVIGATE_TO } from './actions'

export function* locationSaga() {
  yield takeLatest(NAVIGATE_TO, handleNavigateTo)
}

function* handleNavigateTo(action) {
  yield put(push(action.url))
}
