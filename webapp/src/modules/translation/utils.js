const DEFAULT_LANG = 'en'

export function getPreferredLanguage() {
  const navigator = window.navigator

  return (
    (navigator.languages && navigator.languages[0]) ||
    navigator.language ||
    navigator.userLanguage ||
    DEFAULT_LANG
  )
}
