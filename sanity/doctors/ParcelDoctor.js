import { eth } from 'decentraland-eth'
import { env } from 'decentraland-commons'

import { Doctor } from './Doctor'
import { Diagnosis } from './Diagnosis'
import { EstateDiagnosis } from './EstateDoctor'
import { asyncBatch } from '../../src/lib'
import { Parcel, Estate } from '../../src/Asset'
import { BlockchainEvent } from '../../src/BlockchainEvent'
import { Publication } from '../../src/Listing'
import { parseCLICoords } from '../../scripts/utils'

export class ParcelDoctor extends Doctor {
  async diagnose(options) {
    let conditions = null

    if (options.checkParcel) {
      const [x, y] = parseCLICoords(options.checkParcel)
      conditions = { x, y }
    }

    const parcels = await Parcel.find(conditions)
    const faultyParcels = await this.filterInconsistentParcels(parcels)

    return new ParcelDiagnosis(faultyParcels)
  }

  async filterInconsistentParcels(parcels) {
    const faultyParcels = []
    const landRegistry = eth.getContract('LANDRegistry')
    const estateRegistry = eth.getContract('EstateRegistry')

    await asyncBatch({
      elements: parcels,
      callback: async parcelsBatch => {
        const promises = parcelsBatch.map(async parcel => {
          const [currentOwner, currentEstateId] = await Promise.all([
            landRegistry.ownerOf(parcel.token_id),
            estateRegistry.landIdEstate(parcel.token_id)
          ])

          if (this.isPartOfEstateMismatch(currentEstateId.toString(), parcel)) {
            const { id, estate_id } = parcel
            const error = `Mismatch: estate_id of '${id}' is '${estate_id}' on the DB and '${currentEstateId}' in blockchain`
            faultyParcels.push({ ...parcel, currentEstateId, error })
            return
          }

          if (this.isOwnerMismatch(currentOwner, parcel)) {
            const { id, owner } = parcel
            const error = `Mismatch: owner of '${id}' is '${owner}' on the DB and '${currentOwner}' in blockchain`
            faultyParcels.push({ ...parcel, error })
            return
          }

          const currentUpdateOperator = parcel.update_operator

          if (this.isUpdateOperatorMismatch(currentUpdateOperator, parcel)) {
            const { id, update_operator } = parcel
            const error = `Mismatch: operator of '${id}' is '${update_operator}' on the DB and '${currentUpdateOperator}' in blockchain`
            faultyParcels.push({ ...parcel, error })
            return
          }
        })
        await Promise.all(promises)
      },
      batchSize: env.get('BATCH_SIZE'),
      retryAttempts: 20
    })

    return faultyParcels
  }

  isOwnerMismatch(currentOwner, parcel) {
    return !!currentOwner && parcel.owner !== currentOwner
  }

  isUpdateOperatorMismatch(currentUpdateOperator, parcel) {
    return (
      !!currentUpdateOperator &&
      parcel.update_operator !== currentUpdateOperator
    )
  }

  isPartOfEstateMismatch(currentEstateId, parcel) {
    return (
      (parcel.estate_id && parcel.estate_id !== currentEstateId) ||
      (!parcel.estate_id && currentEstateId > 0)
    )
  }
}

export class ParcelDiagnosis extends Diagnosis {
  constructor(faultyParcels) {
    super()
    this.faultyParcels = faultyParcels
    this.estateDiagnosis = new EstateDiagnosis()
  }

  async getFaultyAssets() {
    const faultyAssets = [...this.faultyParcels]
    const estateIds = this.getEstateIds()

    for (const estateId of [...estateIds]) {
      faultyAssets.push(await Estate.findOne({ id: estateId }))
      faultyAssets.concat(await this.estateDiagnosis.getEstateParcels(estateId))
    }

    return faultyAssets
  }

  hasProblems() {
    return this.faultyParcels.length > 0
  }

  async prepare(fromBlock) {
    await asyncBatch({
      elements: this.faultyParcels,
      callback: async parcelsBatch => {
        const promises = parcelsBatch.map(parcel =>
          Promise.all([
            BlockchainEvent.deleteByAnyArgs(
              ['assetId', '_landId'],
              parcel.token_id,
              fromBlock
            ),
            Parcel.update(
              { estate_id: null, update_operator: null },
              { id: parcel.id }
            )
          ])
        )
        await Promise.all(promises)
      },
      batchSize: env.get('BATCH_SIZE'),
      retryAttempts: 20
    })
  }

  async doTreatment() {
    // Run events for Parcels with different estates
    const estateIds = this.getEstateIds()

    // Delete asset publications
    await asyncBatch({
      elements: this.faultyParcels.map(parcel => parcel.id).concat(estateIds),
      callback: async assetIdsBatch => {
        const deletes = assetIdsBatch.map(id => Publication.deleteByAssetId(id))
        await Promise.all(deletes)
      },
      batchSize: env.get('BATCH_SIZE'),
      retryAttempts: 20
    })

    let total = estateIds.size
    for (const [index, estateId] of [...estateIds].entries()) {
      this.log.info(
        `[${index + 1}/${total}]: Treatment for estate Id ${estateId}`
      )

      // Replay events related to the estate
      const events = await this.estateDiagnosis.getEventsToReplay(estateId)
      await this.replayEvents(events)
    }

    total = this.faultyParcels.length
    for (const [index, parcel] of this.faultyParcels.entries()) {
      this.log.info(
        `[${index + 1}/${total}]: Treatment for parcel Id ${parcel.id}`
      )
      const events = await BlockchainEvent.findByAnyArgs(
        ['assetId', '_landId', 'landId', 'tokenId', '_tokenId'],
        parcel.token_id
      )
      await this.replayEvents(events)
    }
  }

  getEstateIds() {
    return new Set(
      this.faultyParcels
        .filter(({ currentEstateId }) => !!currentEstateId)
        .map(({ currentEstateId }) => parseInt(currentEstateId, 10))
    )
  }
}
