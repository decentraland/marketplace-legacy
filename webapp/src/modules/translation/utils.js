import React from 'react'
import { IntlProvider, FormattedMessage, addLocaleData } from 'react-intl'

const DEFAULT_LANG = 'en'
let i18n = null // cache

export const I18nProvider = IntlProvider

export function addAvailableLocaleData() {
  let localeData = []

  for (const localeName of getAvailableLocales()) {
    const data = require(`react-intl/locale-data/${localeName}`)
    localeData = localeData.concat(data)
  }

  addLocaleData(localeData)
}

export function getPreferredLocale() {
  const navigator = window.navigator

  let locale =
    (navigator.languages && navigator.languages[0]) ||
    navigator.language ||
    navigator.userLanguage

  locale = locale.slice(0, 2)

  if (!getAvailableLocales().includes(locale)) {
    locale = DEFAULT_LANG
  }

  return locale
}

export function getAvailableLocales() {
  // This is a hardcoded list that replicates the `Translation/locales` folder on the server
  // It saves us a request
  return ['en', 'es', 'fr', 'zh', 'ko']
}

export function setI18n(intl) {
  i18n = intl
  return i18n
}

export function t(id, values) {
  return i18n.formatMessage({ id }, values)
}

export function t_html(id, values) {
  return <FormattedMessage id={id} values={values} />
}
