import { expect } from 'chai'

import { Translation } from './Translation'

const DEFAULT_LOCALE = Translation.DEFAULT_LOCALE
const translation = new Translation()
let mainTranslations, availableLocales, mainKeys

describe('Translation', () => {
  beforeEach(async () => {
    mainTranslations = await translation.fetch(DEFAULT_LOCALE)
    availableLocales = await translation.getAvailableLocales()
    mainKeys = Object.keys(mainTranslations)
  })
  describe('locales', () =>
    it('should check if default locale is en', () => {
      expect(Translation.DEFAULT_LOCALE).to.be.equal('en')
      context('should check if locales has the same keys', () => {
        for (const locale of availableLocales) {
          if (locale !== DEFAULT_LOCALE) {
            it(`should have the same keys as the default locale. ${locale} = ${DEFAULT_LOCALE}`, async () => {
              const translations = await translation.fetch(locale)
              const keys = Object.keys(translations)
              expect(keys).to.deep.equal(mainKeys)
            })
          }
        }
      })
    }))
})
