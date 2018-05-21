#!/usr/bin/env babel-node
import axios from 'axios'
import fs from 'fs'
import { unflatten } from 'flat'
import { Log, utils } from 'decentraland-commons'
import merge from 'lodash/merge'
import { loadEnv } from './utils'
import { Translation } from '../src/Translation'

const log = new Log('translate')

async function main() {
  const DEFAULT_LOCALE = Translation.DEFAULT_LOCALE
  const translation = new Translation()

  const mainTranslations = await translation.fetch(DEFAULT_LOCALE)
  const availableLocales = await translation.getAvailableLocales()

  const mainKeys = Object.keys(mainTranslations)
  let missing = {}
  for (const locale of availableLocales) {
    if (locale !== DEFAULT_LOCALE) {
      const translations = await translation.fetch(locale)
      for (const key of mainKeys) {
        if (key in translations) {
          // all good
        } else {
          const defaultText = mainTranslations[key]
          let translated = await translate(locale, defaultText)
          if (isCapitalized(defaultText) && !isCapitalized(translated)) {
            translated = translated[0].toUpperCase() + translated.slice(1)
          }
          if (!missing[locale]) {
            missing[locale] = {}
          }
          missing[locale][key] = translated
          log.info(`${locale}(${key}): ${defaultText} -> ${translated}`)
        }
      }
    }
  }
  missing = unflatten(missing)
  log.info(
    'Added the following translations:\n\n',
    JSON.stringify(missing, null, 2),
    '\n'
  )
  for (const locale of availableLocales) {
    const localePath = require('path').resolve(
      __dirname,
      `../src/Translation/locales/${locale}.json`
    )
    const currentTranslations = require(localePath)
    const updatedTranslations = merge(
      currentTranslations,
      missing[locale] || {}
    )
    const orderedTranslations = sortObject(updatedTranslations)
    await utils.promisify(fs.writeFile)(
      localePath,
      JSON.stringify(orderedTranslations, null, 2),
      'utf8'
    )
  }
  log.info('done!')
}

function isCapitalized(text = '') {
  return text[0] === text[0].toUpperCase()
}

function sortObject(unordered) {
  const ordered = {}
  const keys = Object.keys(unordered).sort()
  for (const key of keys) {
    if (unordered[key] != null && typeof unordered[key] === 'object') {
      ordered[key] = sortObject(unordered[key])
    }
    ordered[key] = unordered[key]
  }
  return ordered
}

async function translate(lang, text) {
  /* result example:
  [
    [
        [
            "Debes {sign_in_link} para acceder a esta página",
            "You need to {sign_in_link} to access this page",
            null,
            null,
            3
        ]
    ],
    null,
    "en"
  ]
  */

  const result = await axios.get(
    `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${lang}&dt=t&q=${encodeURIComponent(
      text
    )}`
  )
  return result.data[0][0][0]
}

if (require.main === module) {
  loadEnv()

  Promise.resolve()
    .then(main)
    .catch(console.error)
}
