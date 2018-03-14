import flat from 'flat'

// TODO: Add a cache
//
export function parseTranslations(fileContents) {
  // The translation lib ( https://github.com/yahoo/react-intl ) doesn't support nested values
  // So instead we flatten the structure to look like `{ 'nested.prop': 'value' }`
  const translations = JSON.parse(fileContents)
  return flat(translations)
}
