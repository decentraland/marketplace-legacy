#!/usr/bin/env babel-node

import { Log, env, utils } from 'decentraland-commons'

import { connectDatabase } from '../src/database'
import { Parcel } from '../src/Parcel'

const BOUNDING_BOX_SIZE = parseInt(env.get('BOUNDING_BOX_SIZE', 10), 10)
const log = new Log('tag')

export async function tag() {
  log.info('Connecting database')
  await connectDatabase()

  await tagParcels()

  log.info('All done!')
  process.exit()
}

export async function tagParcels() {
  const landmarks = await Parcel.findLandmarks({ raw: false })
  const parcels = await Parcel.findOwneableParcels({ raw: false })

  log.info(`Tagging ${parcels.length} parcels`)
  for (const parcel of parcels) {
    await tagParcel(parcel, landmarks)
  }
}

export function tagParcel(parcel, landmarks) {
  const tags = {
    ...tagProximity(parcel, landmarks)
  }
  return parcel.update({ tags: JSON.stringify(tags) })
}

export function tagProximity(parcel, landmarks) {
  const proximity = {
    // plaza: { district_id, distance },
    // district: { district_id, distance },
    // road: { district_id, distance }
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
        district_id: landmark.district_id,
        distance
      }
    }
  }

  return utils.isEmptyObject(proximity) ? null : { proximity }
}

if (require.main === module) {
  tag()
    .catch(error => log.error(error))
    .then(() => process.exit())
}
