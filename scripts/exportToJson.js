#!/usr/bin/env babel-node

import fs from 'fs'
import { Log, cli } from 'decentraland-commons'

import { loadEnv } from './utils'
import { db } from '../src/database'
import { District } from '../src/District'
import { Parcel } from '../src/Asset'

const log = new Log('exportToJson')

const exportToJson = {
  addCommands(program) {
    program
      .command('district')
      .description('Export a district to one or more json files')
      .option(
        '--id [id]',
        'Id of the district. You must supply either this or --name'
      )
      .option(
        '--name [name]',
        'Name of the district. You must supply either this or --id'
      )
      .option(
        '--parcelsPerFile [parcelsPerFile]',
        'Max amount of parcels per file. You must supply either this or --parts'
      )
      .option(
        '--parts [parts]',
        'Amount of file parts. You must supply either this or --parcelsPerFile'
      )
      .option(
        '--outDir [outDir]',
        'Where to write the resulting files. Defaults to .'
      )
      .action(async options => {
        const { id, name } = options
        if (!id && !name) {
          throw new Error('You need to supply a district `name` or an `id`')
        }

        const districtQuery = id ? { id } : { name }
        const district = await District.findOne(districtQuery)

        if (!district) {
          throw new Error(
            `Could not find a district for id: ${id} or name: ${name}`
          )
        }

        log.info(`Found district ${district.id}: ${district.name}`)

        const parcels = await Parcel.find({ district_id: district.id })
        log.info(`Found ${parcels.length} parcels for ${district.name}`)

        let parcelsPerFile

        if (options.parcelsPerFile) {
          parcelsPerFile = options.parcelsPerFile
        } else if (options.parts) {
          parcelsPerFile = Math.round(parcels.length / options.parts)
        } else {
          parcelsPerFile = parcels.length
        }

        log.info(`Writing ${parcelsPerFile} parcels per file`)

        const outDir = options.outDir || '.'
        let fileIndex = 1
        let parcelsIndex = 0

        while (parcelsIndex <= parcels.length) {
          const parcelsToWrite = parcels.slice(
            parcelsIndex,
            parcelsIndex + parcelsPerFile
          )
          const filepath = `${outDir}/${district.name}-${fileIndex}.json`

          writeParcels(parcelsToWrite, filepath)

          parcelsIndex += parcelsPerFile
        }

        log.info('All done!')

        process.exit()
      })
  }
}

function writeParcels(parcels, filepath) {
  const parcelsToWrite = parcels.map(parcel => ({ x: parcel.x, y: parcel.y }))
  log.info(`Writing file ${filepath} with ${parcelsToWrite.length} parcels`)
  writeJSON(filepath, parcelsToWrite)
}

function writeJSON(filepath, data) {
  return fs.writeFileSync(filepath, JSON.stringify(data, null, 2))
}

if (require.main === module) {
  loadEnv('../src/.env')

  Promise.resolve()
    .then(() => db.connect())
    .then(() => cli.runProgram([exportToJson]))
    .catch(console.error)
}
