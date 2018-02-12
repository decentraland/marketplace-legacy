import { call, takeLatest, put } from 'redux-saga/effects'
import {
  FETCH_PUBLICATIONS_REQUEST,
  fetchPublicationsSuccess,
  fetchPublicationsFailure
} from './actions'
import { api } from 'lib/api'

export function* publicationSaga() {
  yield takeLatest(FETCH_PUBLICATIONS_REQUEST, handlePublicationsRequest)
}

function* handlePublicationsRequest(action) {
  const { limit, offset, sortBy, sortOrder } = action
  try {
    const publications = yield call(() =>
      api.fetchPublications({ limit, offset, sortBy, sortOrder })
    )
    yield put(fetchPublicationsSuccess(publications))
  } catch (error) {
    yield put(fetchPublicationsFailure(error.message))
  }
}
