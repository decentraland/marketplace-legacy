import { takeLatest, put, select } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { NAVIGATE_TO } from './actions'

export function* locationSaga() {
  yield takeLatest(NAVIGATE_TO, handleNavigateTo)
}

function* handleNavigateTo(action) {
  const { pathname, search } = yield select(state => state.router.location)
  if (pathname + search !== action.url) {
    yield put(push(action.url))
  }
}
