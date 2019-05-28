import { eth } from 'decentraland-eth'
import { env } from 'decentraland-commons'

import { Doctor } from './Doctor'
import { Diagnosis } from './Diagnosis'
import { asyncBatch } from '../../src/lib'
import { ClaimedName } from '../../src/ClaimedName'
import { BlockchainEvent } from '../../src/BlockchainEvent'

export class ClaimedNameDoctor extends Doctor {
  async diagnose() {
    const claimedNames = await ClaimedName.find()
    const faultyClaimedNames = await this.filterInconsistent(claimedNames)

    return new ClaimedNameDiagnosis(faultyClaimedNames)
  }

  async filterInconsistent(claimedNames) {
    const faulyClaimedNames = []

    await asyncBatch({
      elements: claimedNames,
      callback: async claimedNamesBatch => {
        const promises = claimedNamesBatch.map(async claimedName => {
          const error = await this.getInconsistencies(claimedName)

          if (error) {
            faulyClaimedNames.push({ ...claimedName, error })
          }
        })

        await Promise.all(promises)
      },
      batchSize: env.get('BATCH_SIZE'),
      retryAttempts: 20
    })

    return faulyClaimedNames
  }

  async getInconsistencies(claimedName) {
    const { owner, username, metadata } = claimedName

    const avatarNameRegistry = eth.getContract('AvatarNameRegistry')
    const [currentUsername, currentMetadata] = await avatarNameRegistry.user(
      owner
    )

    if (username !== currentUsername) {
      return `Mismatch: username of '${owner}' is '${username}' on the DB and '${currentUsername}' in blockchain`
    }

    if (metadata !== currentMetadata) {
      return `Mismatch: metadata of '${owner}' is '${metadata}' on the DB and '${currentMetadata}' in blockchain`
    }

    return null
  }
}

export class ClaimedNameDiagnosis extends Diagnosis {
  constructor(faultyClaimedNames) {
    super()
    this.faultyClaimedNames = faultyClaimedNames
  }

  async getFaultyAssets() {
    return this.faultyClaimedNames
  }

  hasProblems() {
    // Always run this doctor.
    // There is no way to check if a specific claim is missing because of how the contract
    // stores those mappings
    return true
  }

  async prepare(fromBlock) {
    await asyncBatch({
      elements: this.faultyClaimedNames,
      callback: async claimedNameBatch => {
        const deletes = claimedNameBatch.map(claimedName =>
          ClaimedName.delete({ owner: claimedName.owner })
        )
        await Promise.all(deletes)
      },
      batchSize: env.get('BATCH_SIZE'),
      retryAttempts: 20
    })

    const avatarNameRegistry = eth.getContract('AvatarNameRegistry')

    return BlockchainEvent.deleteByAddress(
      avatarNameRegistry.address,
      fromBlock
    )
  }

  async doTreatment() {
    const { fromBlock } = this

    const avatarNameRegistry = eth.getContract('AvatarNameRegistry')

    const events = await BlockchainEvent.findByAddress(
      avatarNameRegistry.address,
      fromBlock
    )
    await this.replayEvents(events)
  }
}
