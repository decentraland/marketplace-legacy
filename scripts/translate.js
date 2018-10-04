#!/usr/bin/env babel-node
import axios from 'axios'
import fs from 'fs'
import flat, { unflatten } from 'flat'
import { env, Log, utils } from 'decentraland-commons'
import merge from 'lodash/merge'
import { loadEnv } from './utils'
import { Translation } from '../src/Translation'

let BATCH_SIZE = 10
const log = new Log('translate')

const nonTranslatable = [
  'Decentraland',
  'LAND',
  'MANA',
  'MortgageHelper',
  'MortgageManager',
  'Estate'
]

const TRANSLATION_KEY = 'tk'
const NON_TRANSLATABLE_KEY = 'nt'

async function main() {
  const DEFAULT_LOCALE = Translation.DEFAULT_LOCALE
  const translation = new Translation()

  const mainTranslations = await translation.fetch(DEFAULT_LOCALE)
  const availableLocales = await translation.getAvailableLocales()
  const translations = []
  translations[DEFAULT_LOCALE] = mainTranslations

  const mainKeys = Object.keys(mainTranslations)
  let missing = {}
  for (const locale of availableLocales) {
    if (locale !== DEFAULT_LOCALE) {
      translations[locale] = await translation.fetch(locale)
      let requests = []
      for (const key of mainKeys) {
        const hasTranslation = key in translations[locale]
        if (!hasTranslation) {
          const defaultText = mainTranslations[key]
          const replacedKeys = {}
          // replace real keys to placeholders
          let textToTranslate = defaultText.replace(/{(.+?)}/g, str => {
            const key = `${TRANSLATION_KEY}${Object.keys(replacedKeys).length}`
            replacedKeys[key] = str
            return key
          })
          // replace non-translatable words to placeholders
          nonTranslatable.forEach((word, index) => {
            textToTranslate = textToTranslate.replace(
              new RegExp(word, 'g'),
              `${NON_TRANSLATABLE_KEY}${index}`
            )
          })

          requests.push(
            translate(locale, textToTranslate).then(text => ({
              locale,
              key,
              text,
              replacedKeys,
              defaultText
            }))
          )

          if (requests.length > BATCH_SIZE) {
            await processBatch(requests, missing)
            requests = []
          }
        }
      }
      if (requests.length > 0) {
        await processBatch(requests, missing)
        requests = []
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
    const currentTranslations = flat(require(localePath))
    // remove obsolete keys
    let cleanedTranslations = Object.keys(translations[locale])
      .filter(key => key in mainTranslations)
      .reduce((acc, key) => {
        acc[key] = currentTranslations[key]
        return acc
      }, {})
    cleanedTranslations = unflatten(cleanedTranslations)

    const updatedTranslations = merge(
      cleanedTranslations,
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

async function processBatch(requests, missing) {
  const translated = await Promise.all(requests)
  translated.forEach(({ locale, key, text, replacedKeys, defaultText }) => {
    // restore real keys
    Object.keys(replacedKeys).forEach(key => {
      text = text.replace(key, replacedKeys[key])
    })
    // restore non-translatable words
    nonTranslatable.forEach((word, index) => {
      text = text.replace(
        new RegExp(`${NON_TRANSLATABLE_KEY}${index}`, 'g'),
        nonTranslatable[index]
      )
    })
    if (isCapitalized(defaultText) && !isCapitalized(text)) {
      text = capitalize(text)
    }
    if (!missing[locale]) {
      missing[locale] = {}
    }
    missing[locale][key] = text
    log.info(`${locale}(${key}): ${defaultText} -> ${text}`)
  })
}

function isCapitalized(text = '') {
  return text[0] === text[0].toUpperCase()
}

function capitalize(text) {
  return text[0].toUpperCase() + text.slice(1)
}

function sortObject(unordered) {
  const ordered = {}
  const keys = Object.keys(unordered).sort()
  for (const key of keys) {
    if (unordered[key] != null && typeof unordered[key] === 'object') {
      ordered[key] = sortObject(unordered[key])
    } else {
      ordered[key] = unordered[key]
    }
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
  BATCH_SIZE = parseInt(env.get('BATCH_SIZE', 10), 10)
  log.info(`Using ${BATCH_SIZE} as batch size, configurable via BATCH_SIZE`)

  Promise.resolve()
    .then(main)
    .catch(console.error)
}
