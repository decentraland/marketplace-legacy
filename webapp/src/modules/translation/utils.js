import React from 'react'
import { FormattedMessage } from 'react-intl'

const DEFAULT_LANG = 'en'
let i18n = null // cache

export function getPreferredLanguage() {
  const navigator = window.navigator

  return (
    (navigator.languages && navigator.languages[0]) ||
    navigator.language ||
    navigator.userLanguage ||
    DEFAULT_LANG
  )
}

export function setupI18n(intl) {
  i18n = intl
  return i18n
}

export function t(id, values) {
  return i18n.formatMessage({ id }, values)
}

export function t_html(id, values) {
  return <FormattedMessage id={id} values={values} />
}
