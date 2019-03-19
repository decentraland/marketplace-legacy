import { eth } from 'decentraland-eth'
import { Log, env } from 'decentraland-commons'
import { Doctor } from './Doctor'
import { Diagnosis } from './Diagnosis'
import { asyncBatch } from '../../src/lib'
import { Parcel, Estate } from '../../src/Asset'
import { Publication } from '../../src/Listing'
import { BlockchainEvent } from '../../src/BlockchainEvent'
import { ASSET_TYPES } from '../../shared/asset'
import { isParcel } from '../../shared/parcel'
import { LISTING_STATUS } from '../../shared/listing'
import { parseCLICoords } from '../../scripts/utils'

const log = new Log('PublicationDoctor')

export class PublicationDoctor extends Doctor {
  async diagnose(options) {
    let parcels
    let estates

    if (options.checkParcel) {
      const [x, y] = parseCLICoords(options.checkParcel)
      parcels = await Parcel.find({ x, y })
      estates = []
    } else {
      parcels = await Parcel.find()
      estates = await Estate.find()
    }

    const assets = parcels.concat(estates)
    const faultyAssets = await this.filterInconsistentPublishedAssets(assets)
    const inactivePublications = await Publication.findInactive()

    return new PublicationDiagnosis(faultyAssets, inactivePublications)
  }

  async filterInconsistentPublishedAssets(allAssets) {
    const faultyAssets = []

    await asyncBatch({
      elements: allAssets,
      callback: async assetsBatch => {
        const promises = assetsBatch.map(async asset => {
          let error = await this.getPublicationInconsistencies(asset)

          // If there is an error does not look for legacy publications
          if (isParcel(asset) && !error.length) {
            error = await this.getLegacyPublicationInconsistencies(asset)
          }

          if (error.length) {
            log.error(error)
            faultyAssets.push({ ...asset, error })
          }
        })
        await Promise.all(promises)
      },
      batchSize: env.get('BATCH_SIZE'),
      retryAttempts: 20
    })

    return faultyAssets
  }

  async getPublicationInconsistencies(asset) {
    if (!asset) return ''

    const { id, token_id } = asset
    const marketplace = eth.getContract('Marketplace')
    const nftAddress = this.getNFTAddressFromAsset(asset)
    const assetType = isParcel(asset) ? ASSET_TYPES.parcel : ASSET_TYPES.estate
    const publication = (await Publication.findByAssetId(id, assetType))[0]
    const order = await marketplace.orderByAssetId(nftAddress, token_id)
    const contractId = order[0]

    return this.getPublicationError(id, publication, contractId)
  }

  async getLegacyPublicationInconsistencies(parcel) {
    if (!parcel) return ''

    const { id, token_id } = parcel
    const marketplace = eth.getContract('LegacyMarketplace')
    const publication = (await Publication.findByAssetId(
      id,
      ASSET_TYPES.parcel
    ))[0]
    const auction = await marketplace.auctionByAssetId(token_id)
    const contractId = auction[0]

    return this.getPublicationError(id, publication, contractId)
  }

  getPublicationError(assetId, publication, contractId) {
    let error = ''

    if (!this.isNullHash(contractId)) {
      if (!publication) {
        // Check if the publication exists in db
        error = `${assetId} missing publication in db`
      } else if (publication.contract_id !== contractId) {
        // Check that id matches
        error = [
          `${assetId} different id in db`,
          publication.contract_id,
          'vs in blockchain',
          contractId
        ].join(' ')
      }
    } else if (publication && publication.status === LISTING_STATUS.open) {
      // Check for hanging publication in db
      error = `${assetId} open in db and null in blockchain`
    }

    return error
  }

  isNullHash(hash) {
    const NULL =
      '0x0000000000000000000000000000000000000000000000000000000000000000'
    const NULL_PARITY = '0x'
    return hash === NULL || hash === NULL_PARITY
  }

  // TODO: Find a common place for this
  getNFTAddressFromAsset(asset) {
    if (isParcel(asset)) {
      return env.get('LAND_REGISTRY_CONTRACT_ADDRESS')
    } else {
      return env.get('ESTATE_REGISTRY_CONTRACT_ADDRESS')
    }
  }
}

export class PublicationDiagnosis extends Diagnosis {
  constructor(faultyAssets, inactivePublications) {
    super()
    this.faultyAssets = faultyAssets
    this.inactivePublications = inactivePublications
  }

  hasProblems() {
    return this.faultyAssets.length > 0 || this.inactivePublications.length > 0
  }

  async prepare() {
    // TODO: asset_type
    return asyncBatch({
      elements: this.faultyAssets,
      callback: async assetsBatch => {
        const deletes = assetsBatch.map(asset =>
          BlockchainEvent.deleteByArgs('assetId', asset.token_id)
        )
        return Promise.all(deletes)
      },
      batchSize: env.get('BATCH_SIZE'),
      retryAttempts: 20
    })
  }

  async doTreatment() {
    // TODO: asset_type
    await asyncBatch({
      elements: this.faultyAssets,
      callback: async assetsBatch => {
        const deletes = assetsBatch.map(asset =>
          Publication.deleteByAssetId(asset.id)
        )

        return Promise.all(deletes)
      },
      batchSize: env.get('BATCH_SIZE'),
      retryAttempts: 20
    })

    // TODO: add NFTAddress
    for (const asset of this.faultyAssets) {
      const events = await BlockchainEvent.findByArgs('assetId', asset.token_id)
      await this.replayEvents(events)
    }

    if (this.inactivePublications.length > 0) {
      await Publication.updateExpired()
    }
  }
}
