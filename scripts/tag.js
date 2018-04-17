#!/usr/bin/env babel-node

import { Log, env } from 'decentraland-commons'

import { db } from '../src/database'
import { Parcel } from '../src/Parcel'
import { loadEnv } from './utils'

let BOUNDING_BOX_SIZE
const log = new Log('tag')

export async function tag() {
  log.info('Connecting database')
  await db.connect()

  await tagParcels()

  log.info('All done!')
  process.exit()
}

export async function tagParcels() {
  const landmarks = (await Parcel.findLandmarks()).map(toParcelInstance)
  const parcels = (await Parcel.findOwneableParcels()).map(toParcelInstance)

  log.info(`Tagging ${parcels.length} parcels`)
  for (const parcel of parcels) {
    await tagParcel(parcel, landmarks)
  }
}

export function tagParcel(parcel, landmarks) {
  const tags = {
    // plaza_distance: null,
    // district_distance: null,
    // road_distance: null
  }

  for (const landmark of landmarks) {
    if (!landmark.isWithinBoundingBox(parcel, BOUNDING_BOX_SIZE)) continue

    const distance = landmark.distanceTo(parcel)
    const length = distance - 1 // So parcels next to eachother have a distance of 0

    const tag_name = landmark.isPlaza()
      ? 'plaza_distance'
      : landmark.isRoad() ? 'road_distance' : 'district_distance'

    if (!tags[tag_name] || length < tags[tag_name].length) {
      tags[tag_name] = {
        id: landmark.get('district_id'),
        length
      }
    }
  }

  const dbTags = Object.keys(tags).length ? JSON.stringify(tags) : null

  return Parcel.update({ tags: dbTags }, { id: parcel.get('id') })
}

function toParcelInstance(attributes) {
  return new Parcel(attributes)
}

if (require.main === module) {
  loadEnv()
  BOUNDING_BOX_SIZE = parseInt(env.get('BOUNDING_BOX_SIZE', 10), 10)
  log.info(
    `Using ${BOUNDING_BOX_SIZE} as bounding size, configurable via BOUNDING_BOX_SIZE`
  )

  Promise.resolve()
    .then(tag)
    .catch(console.error)
}
