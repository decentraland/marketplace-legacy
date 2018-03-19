import { takeEvery, put, call } from 'redux-saga/effects'
import {
  FETCH_TRANSLATIONS_REQUEST,
  INITIALIZE_TRANSLATIONS,
  fetchTranslationsSuccess,
  fetchTranslationsFailure
} from './actions'
import { setI18n, setCurrentLocale } from './utils'
import { api } from 'lib/api'

export function* translationSaga() {
  yield takeEvery(FETCH_TRANSLATIONS_REQUEST, handleFetchTranslationsRequest)
  yield takeEvery(INITIALIZE_TRANSLATIONS, handleInitializeTranslations)
}

function* handleFetchTranslationsRequest(action) {
  try {
    const { locale } = action
    const translations = yield call(() => api.fetchTranslations(locale))

    setCurrentLocale(locale)

    yield put(fetchTranslationsSuccess(locale, translations))
  } catch (error) {
    yield put(fetchTranslationsFailure(error.message))
  }
}

function handleInitializeTranslations(action) {
  setI18n(action.intl)
}
