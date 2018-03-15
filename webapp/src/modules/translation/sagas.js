import { takeEvery, put, call } from 'redux-saga/effects'
import {
  FETCH_TRANSLATIONS_REQUEST,
  fetchTranslationsSuccess,
  fetchTranslationsFailure
} from './actions'
import { api } from 'lib/api'

export function* translationSaga() {
  yield takeEvery(FETCH_TRANSLATIONS_REQUEST, handleFetchTranslationsRequest)
}

function* handleFetchTranslationsRequest(action) {
  try {
    const { locale } = action
    const translations = yield call(() => api.fetchTranslations(locale))

    yield put(fetchTranslationsSuccess(locale, translations))
  } catch (error) {
    yield put(fetchTranslationsFailure(error.message))
  }
}
