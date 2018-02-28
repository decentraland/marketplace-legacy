import { takeLatest, put, select } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { NAVIGATE_TO } from './actions'

export function* locationSaga() {
  yield takeLatest(NAVIGATE_TO, handleNavigateTo)
}

function* handleNavigateTo(action) {
  // We're aware of https://github.com/reactjs/react-router-redux#how-do-i-access-router-state-in-a-container-component
  // But in this particular case, we're outside the lifecycle of React so it shouldn't be a problem
  const { pathname, search } = yield select(state => state.router.location)
  if (pathname + search !== action.url) {
    yield put(push(action.url))
  }
}
