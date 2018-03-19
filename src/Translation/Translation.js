import fs from 'fs'
import flat from 'flat'
import path from 'path'
import { env, utils } from 'decentraland-commons'

export class Translation {
  static DEFAULT_LOCALE = 'en'

  constructor() {
    this.localesPath = env.get(
      'LOCALES_PATH',
      path.resolve(__dirname, './locales')
    )
    this.cache = {} // {locale: translations}
  }

  async fetch(locale) {
    if (!this.cache[locale]) {
      const availableLocales = await this.getAvailableLocales()

      if (availableLocales.includes(locale)) {
        this.cache[locale] = this.parse(await this.readFile(locale))
      }
    }

    return this.cache[locale] || {}
  }

  async getAvailableLocales() {
    const files = await utils.promisify(fs.readdir)(this.localesPath)
    return files.map(filePath =>
      path.basename(filePath, path.extname(filePath))
    )
  }

  parse(fileContents) {
    // The translation lib ( https://github.com/yahoo/react-intl ) doesn't support nested values
    // So instead we flatten the structure to look like `{ 'nested.prop': 'value' }`
    const translations = JSON.parse(fileContents)
    return flat(translations)
  }

  async readFile(locale) {
    return await utils.promisify(fs.readFile)(
      path.resolve(this.localesPath, `${locale}.json`),
      'utf8'
    )
  }
}
