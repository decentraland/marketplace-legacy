// Fetch translations

export const FETCH_TRANSLATIONS_REQUEST = '[Request] Fetch Translations'
export const FETCH_TRANSLATIONS_SUCCESS = '[Success] Fetch Translations'
export const FETCH_TRANSLATIONS_FAILURE = '[Failure] Fetch Translations'

export function fetchTranslationsRequest(locale) {
  return {
    type: FETCH_TRANSLATIONS_REQUEST,
    locale
  }
}

export function fetchTranslationsSuccess(locale, translations) {
  return {
    type: FETCH_TRANSLATIONS_SUCCESS,
    locale,
    translations
  }
}

export function fetchTranslationsFailure(error) {
  return {
    type: FETCH_TRANSLATIONS_FAILURE,
    error
  }
}

// Initialize I18n object
export const INITIALIZE_TRANSLATIONS = 'Initialize translations'

export function initTranslations(intl) {
  return {
    type: INITIALIZE_TRANSLATIONS,
    intl
  }
}
