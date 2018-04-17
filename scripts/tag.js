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
    proximity: tagProximity(parcel, landmarks)
  }

  return Parcel.update({ tags: JSON.stringify(tags) }, { id: parcel.get('id') })
}

export function tagProximity(parcel, landmarks) {
  const proximity = {
    // plaza: null,
    // district: null,
    // road: null
  }

  for (const landmark of landmarks) {
    if (!landmark.isWithinBoundingBox(parcel, BOUNDING_BOX_SIZE)) continue

    // We substract 1 so parcels next to eachother have a distance of 0
    const distance = landmark.distanceTo(parcel) - 1

    const tag_name = landmark.isPlaza()
      ? 'plaza'
      : landmark.isRoad() ? 'road' : 'district'

    if (!proximity[tag_name] || distance < proximity[tag_name].distance) {
      proximity[tag_name] = {
        district_id: landmark.get('district_id'),
        distance
      }
    }
  }

  return Object.keys(proximity).length ? proximity : null
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
