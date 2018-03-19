import { expect } from 'chai'

import { Translation } from './Translation'

const DEFAULT_LOCALE = Translation.DEFAULT_LOCALE
const translation = new Translation()

describe('Translation locales', async function() {
  const mainTranslations = await translation.fetch(DEFAULT_LOCALE)
  const availableLocales = await translation.getAvailableLocales()

  const mainKeys = Object.keys(mainTranslations)

  for (const locale of availableLocales) {
    if (locale !== DEFAULT_LOCALE) {
      it(`should have the same keys as the default locale. ${locale} = ${DEFAULT_LOCALE}`, async function() {
        const translations = await translation.fetch(locale)
        const keys = Object.keys(translations)
        expect(keys).to.deep.equal(mainKeys)
      })
    }
  }
})
