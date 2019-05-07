import { eth, Contract } from 'decentraland-eth'
import { env } from 'decentraland-commons'

import { Doctor } from './Doctor'
import { Diagnosis } from './Diagnosis'
import { asyncBatch } from '../../src/lib'
import { Parcel, Estate } from '../../src/Asset'
import { BlockchainEvent } from '../../src/BlockchainEvent'
import { eventNames } from '../../src/ethereum'
import { Publication } from '../../src/Listing'

export class EstateDoctor extends Doctor {
  async diagnose() {
    const estates = await Estate.find()
    const faultyEstates = await this.filterInconsistentEstates(estates)

    return new EstateDiagnosis(faultyEstates)
  }

  async filterInconsistentEstates(allEstates) {
    const faultyEstates = []

    await asyncBatch({
      elements: allEstates,
      callback: async estatesBatch => {
        const promises = estatesBatch.map(async estate => {
          const error = await this.getEstateInconsistencies(estate)

          if (error) {
            faultyEstates.push({ ...estate, error })
          }
        })

        await Promise.all(promises)
      },
      batchSize: env.get('BATCH_SIZE'),
      retryAttempts: 20
    })

    return faultyEstates
  }

  async getEstateInconsistencies(estate) {
    const { id, owner, operator, update_operator, data } = estate
    const { parcels } = data

    const estateRegistry = eth.getContract('EstateRegistry')
    const [
      currentOwner,
      currentOperator,
      currentUpdateOperator
    ] = await Promise.all([
      estateRegistry.ownerOf(estate.id),
      estateRegistry.getApproved(estate.id),
      estateRegistry.updateOperator(estate.id)
    ])

    if (owner !== currentOwner) {
      return `Mismatch: owner of '${id}' is '${owner}' on the DB and '${currentOwner}' in blockchain`
    }

    if (this.isOperatorMismatch(currentOperator, operator)) {
      return `Mismatch: operator of '${id}' is '${operator}' on the DB and '${currentOperator}' in blockchain`
    }

    if (this.isOperatorMismatch(currentUpdateOperator, update_operator)) {
      return `Mismatch: update operator of '${id}' is '${update_operator}' on the DB and '${currentUpdateOperator}' in blockchain`
    }

    const currentParcels = await this.getCurrentEstateParcels()

    if (!this.isEqualParcels(currentParcels, parcels)) {
      return `Parcels: db parcels for estate ${id} are different from blockchain`
    }

    return null
  }

  async getCurrentEstateParcels(estate) {
    const estateRegistry = eth.getContract('EstateRegistry')
    const estateSize = await estateRegistry.getEstateSize(estate.id)

    let currentParcels = []
    let index = 0

    await asyncBatch({
      elements: new Array(estateSize.toNumber()),
      callback: async sizeBatch => {
        const promises = []
        for (let i = 0; i < sizeBatch.length; i++) {
          promises.push(this.buildCurrentEstateParcel(estate.id, index++))
        }

        const parcels = await Promise.all(promises)
        currentParcels = [...currentParcels, ...parcels]
      },
      batchSize: env.get('BATCH_SIZE'),
      logFormat: '',
      retryAttempts: 20
    })

    return currentParcels
  }

  async buildCurrentEstateParcel(estateId, index) {
    const estateRegistry = eth.getContract('EstateRegistry')
    const tokenId = await estateRegistry.estateLandIds(estateId, index)
    const parcelId = await Parcel.decodeTokenId(tokenId.toString())
    const [x, y] = Parcel.splitId(parcelId)
    return { x, y }
  }

  isEqualParcels(left = [], right = []) {
    if (left.length !== right.length) {
      return false
    }

    const leftIds = left.map(({ x, y }) => Parcel.buildId(x, y)).sort()
    const rightIds = right.map(({ x, y }) => Parcel.buildId(x, y)).sort()

    return leftIds.every((parcelId, index) => parcelId === rightIds[index])
  }

  isOperatorMismatch(currentOperator, operator) {
    return (
      (!operator && !Contract.isEmptyAddress(currentOperator)) ||
      (operator && operator !== currentOperator)
    )
  }
}

export class EstateDiagnosis extends Diagnosis {
  constructor(faultyEstates) {
    super()
    this.faultyEstates = faultyEstates
  }

  async getFaultyAssets() {
    const faultyAssets = [...this.faultyEstates]

    for (const estate of this.faultyEstates) {
      const parcels = await this.getEstateParcels(estate.id)
      faultyAssets.push(...parcels)
    }
    return faultyAssets
  }

  hasProblems() {
    return this.faultyEstates.length > 0
  }

  async prepare(fromBlock) {
    await asyncBatch({
      elements: this.faultyEstates,
      callback: async estatesBatch => {
        const deletes = estatesBatch.map(estate =>
          Estate.deleteBlockchainEvents(estate.id, fromBlock)
        )
        await Promise.all(deletes)
      },
      batchSize: env.get('BATCH_SIZE'),
      retryAttempts: 20
    })
  }

  async doTreatment() {
    await asyncBatch({
      elements: this.faultyEstates,
      callback: async estatesBatch => {
        const deletes = estatesBatch.map(estate =>
          Promise.all([
            Publication.deleteByAssetId(estate.id),
            Estate.delete({ id: estate.id })
          ])
        )
        await Promise.all(deletes)
      },
      batchSize: env.get('BATCH_SIZE'),
      retryAttempts: 20
    })

    // Replay events for the estate and old parcels
    const total = this.faultyEstates.length
    for (const [index, estate] of this.faultyEstates.entries()) {
      this.log.info(
        `[${index + 1}/${total}]: Treatment for estate Id ${estate.id}`
      )

      const events = await this.getEventsToReplay(estate.id)
      await this.replayEvents(events)
    }
  }

  async getEventsToReplay(estateId) {
    const estateEvents = await Estate.findBlockchainEvents(estateId)
    let allEvents = []

    for (const event of estateEvents) {
      if (
        event.name === eventNames.AddLand ||
        event.name === eventNames.RemoveLand
      ) {
        // Replay parcels events based on AddLand and RemoveLand estate events
        const events = await BlockchainEvent.findByAnyArgs(
          ['_landId'],
          event.args._landId
        )
        allEvents = allEvents.concat(events)
      } else {
        // Replay estate events only for update or creation
        allEvents.push(event)
      }
    }

    return allEvents
  }

  async getEstateParcels(estateId) {
    const parcels = []
    const estateEvents = await Estate.findBlockchainEvents(estateId)

    // Get parcels where events are going to be replayed
    for (const event of estateEvents) {
      if (
        event.name === eventNames.AddLand ||
        event.name === eventNames.RemoveLand
      ) {
        const parcel = await Parcel.findOne({ token_id: event.args._landId })
        parcels.push(parcel)
      }
    }
    return parcels
  }
}
