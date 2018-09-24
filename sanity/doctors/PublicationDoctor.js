import { eth } from 'decentraland-eth'
import { Log, env } from 'decentraland-commons'
import { Doctor } from './Doctor'
import { Diagnosis } from './Diagnosis'
import { asyncBatch } from '../../src/lib'
import { Parcel } from '../../src/Parcel'
import { Publication } from '../../src/Publication'
import { BlockchainEvent } from '../../src/BlockchainEvent'
import { PUBLICATION_STATUS } from '../../shared/publication'
import { parseCLICoords } from '../../scripts/utils'

const log = new Log('PublicationDoctor')

export class PublicationDoctor extends Doctor {
  async diagnose(options) {
    let conditions = null

    if (options.checkParcel) {
      const [x, y] = parseCLICoords(options.checkParcel)
      conditions = { x, y }
    }

    const parcels = await Parcel.find(conditions)
    const faultyParcels = await this.filterInconsistentPublishedParcels(parcels)

    return new PublicationDiagnosis(faultyParcels)
  }

  async filterInconsistentPublishedParcels(allParcels) {
    const faultyParcels = []

    await asyncBatch({
      elements: allParcels,
      callback: async parcelsBatch => {
        const promises = parcelsBatch.map(async parcel => {
          const error = await this.getPublicationInconsistencies(parcel)

          if (error) {
            log.error(error)
            faultyParcels.push({ ...parcel, error })
          }
        })
        await Promise.all(promises)
      },
      batchSize: env.get('BATCH_SIZE'),
      retryAttempts: 20
    })

    return faultyParcels
  }

  async getPublicationInconsistencies(parcel) {
    if (!parcel) return ''

    const { id, token_id } = parcel
    const marketplace = eth.getContract('LegacyMarketplace')
    const auction = await marketplace.auctionByAssetId(token_id)
    const publication = (await Publication.findByAssetId(id))[0]
    const contractId = auction[0]

    let errors = ''

    if (!this.isNullHash(contractId)) {
      if (!publication) {
        // Check if the publication exists in db
        errors = `${id} missing publication in db`
      } else if (publication.contract_id !== contractId) {
        // Check that id matches
        errors = [
          `${id} different id in db`,
          publication.contract_id,
          'vs in blockchain',
          contractId
        ].join(' ')
      }
    } else if (publication && publication.status === PUBLICATION_STATUS.open) {
      // Check for hanging publication in db
      errors = `${id} open in db and null in blockchain`
    }

    return errors
  }

  isNullHash(hash) {
    const NULL =
      '0x0000000000000000000000000000000000000000000000000000000000000000'
    const NULL_PARITY = '0x'
    return hash === NULL || hash === NULL_PARITY
  }
}

export class PublicationDiagnosis extends Diagnosis {
  constructor(faultyParcels) {
    super()
    this.faultyParcels = faultyParcels
  }

  hasProblems() {
    return this.faultyParcels.length > 0
  }

  async prepare() {
    const deletes = this.faultyParcels.map(parcel =>
      BlockchainEvent.deleteByArgs('assetId', parcel.token_id)
    )
    return Promise.all(deletes)
  }

  async doTreatment() {
    await Promise.all(
      this.faultyParcels.map(parcel => Publication.deleteByAsset(parcel))
    )

    for (const parcel of this.faultyParcels) {
      const events = await BlockchainEvent.findByArgs(
        'assetId',
        parcel.token_id
      )
      await this.replayEvents(events)
    }
  }
}
