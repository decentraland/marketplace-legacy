#!/usr/bin/env babel-node

import fs from 'fs'
import { execSync } from 'child_process'
import { Log, env } from 'decentraland-commons'

import { loadEnv, resolvePath, runpsql } from './utils'

const log = new Log('restoreDump')

export async function restoreDump(dumpPath) {
  if (!dumpPath) {
    throw new Error(
      'Empty dump path. Please add it as an argument when running this script'
    )
  }

  const connectionString = env.get('CONNECTION_STRING')
  if (!connectionString) {
    throw new Error('Connection string empty. Please fill your env file')
  }

  const databaseName = connectionString.split('/').pop()
  const dumpFullPath = resolvePath(dumpPath)

  if (!fs.existsSync(dumpFullPath)) {
    throw new Error(`Couldn't find dump file "${dumpFullPath}"`)
  }

  log.info(`Reseting ${databaseName}`)
  execSync(`psql -c 'DROP DATABASE IF EXISTS ${databaseName}'`)
  execSync(`psql -c 'CREATE DATABASE ${databaseName};'`)

  log.info(`Running dump ${dumpFullPath}`)
  execSync(runpsql(dumpPath))

  log.info('Migrating')
  execSync('npm run migrate up')

  log.info('All done!')
  process.exit()
}

if (require.main === module) {
  loadEnv()

  const dumpPath = process.argv.length > 2 ? process.argv.pop() : ''

  Promise.resolve()
    .then(() => restoreDump(dumpPath))
    .catch(console.error)
}
