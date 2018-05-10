#!/usr/bin/env babel-node

import { loadEnv } from './utils'

export default function runScript(scriptName) {
  if (!scriptName) {
    throw new Error('Supply a script name to run')
  }

  loadEnv()

  const scriptExports = require(`./${scriptName}`)
  const exportName = scriptName.split('/').pop()

  if (!scriptExports[exportName]) {
    throw new Error(
      `Script ${exportName} from ${scriptName} does not contain an export of the same name.\nExports: ${Object.keys(
        scriptExports
      )}`
    )
  }

  return scriptExports[exportName]()
}

if (require.main === module) {
  const scriptName = process.argv.slice(2)[0] // get script name after this scripts path
  process.argv.splice(2, 1) // remove from argv
  runScript(scriptName)
}
