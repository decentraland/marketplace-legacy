import React from 'react'
import { IntlProvider, FormattedMessage, addLocaleData } from 'react-intl'

// Check the method: getAvailableLocales below to see which locales to add
// Then, you'll need to add it to: addAvailableLocaleData and setCurrentLocale
// This is annoying but better than bundling 200KB of locales
import enIntlData from 'react-intl/locale-data/en'
import esIntlData from 'react-intl/locale-data/es'
import frIntlData from 'react-intl/locale-data/fr'
import koIntlData from 'react-intl/locale-data/ko'
import zhIntlData from 'react-intl/locale-data/zh'

import enFnsData from 'date-fns/locale/en'
import esFnsData from 'date-fns/locale/es'
import frFnsData from 'date-fns/locale/fr'
import koFnsData from 'date-fns/locale/ko'
import zhFnsData from 'date-fns/locale/zh_cn'

const DEFAULT_LOCALE = 'en'

// cache
let i18n = null
let currentLocale = null

export const I18nProvider = IntlProvider

export function addAvailableLocaleData() {
  addLocaleData(
    Array.prototype.concat(
      enIntlData,
      esIntlData,
      frIntlData,
      zhIntlData,
      koIntlData
    )
  )
}

export function getPreferredLocale() {
  const navigator = window.navigator

  let locale =
    (navigator.languages && navigator.languages[0]) ||
    navigator.language ||
    navigator.userLanguage

  locale = locale.slice(0, 2)

  if (!getAvailableLocales().includes(locale)) {
    locale = DEFAULT_LOCALE
  }

  return locale
}

export function getAvailableLocales() {
  // This is a hardcoded list that replicates the `Translation/locales` folder on the server
  // It saves us a request
  return ['en', 'zh', 'ko', 'es', 'fr']
}

export function setI18n(intl) {
  i18n = intl
}

export function setCurrentLocale(localeName) {
  currentLocale = {
    en: enFnsData,
    es: esFnsData,
    fr: frFnsData,
    zh: zhFnsData,
    ko: koFnsData
  }[localeName || DEFAULT_LOCALE]
}

export function getCurrentLocale(locale) {
  return currentLocale
}

export function t(id, values) {
  return i18n.formatMessage({ id }, values)
}

export function t_html(id, values) {
  return <FormattedMessage id={id} values={values} />
}
