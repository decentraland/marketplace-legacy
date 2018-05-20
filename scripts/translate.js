#!/usr/bin/env babel-node
import axios from 'axios'
import fs from 'fs'
import { unflatten } from 'flat'
import { utils } from 'decentraland-commons'
import merge from 'lodash/merge'
import { loadEnv } from './utils'

//import axios from 'axios'
import { Translation } from '../src/Translation'

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
          console.log(`${locale}(${key}): ${defaultText} -> ${translated}`)
        }
      }
    }
  }
  missing = unflatten(missing)
  console.log(
    '\n\nAdded the following translations:\n\n',
    JSON.stringify(missing, null, 2)
  )
  const locales = Object.keys(missing)
  for (const locale of locales) {
    const localePath = require('path').resolve(
      __dirname,
      `../src/Translation/locales/${locale}.json`
    )
    const currentTranslations = require(localePath)
    const updatedTranslations = merge(currentTranslations, missing[locale])
    await utils.promisify(fs.writeFile)(
      localePath,
      JSON.stringify(updatedTranslations, null, 2),
      'utf8'
    )
  }
  console.log('\ndone!')
}

function isCapitalized(text = '') {
  return text[0] === text[0].toUpperCase()
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
