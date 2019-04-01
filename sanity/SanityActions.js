import { Log, env } from 'decentraland-commons'
import { eth } from 'decentraland-eth'

import { MonitorActions } from '../monitor/MonitorActions'
import { main as indexMissingEvents } from '../monitor/program'
import { doctors } from './doctors'
import { getCountOfEvents } from '../src/ethereum'
import { asyncBatch } from '../src/lib'
import { isParcel } from '../shared/parcel'
import { ASSET_TYPES } from '../shared/asset'
import { Tile } from '../src/Tile'
import { Parcel, Estate } from '../src/Asset'
import { BlockchainEvent } from '../src/BlockchainEvent'
import { eventNames } from '../src/ethereum'
import { processEvent } from '../monitor/processEvents'

const log = new Log('Sanity')

export class SanityActions {
  async run(options = {}) {
    const validations = this.getValidations(options.skip)
    const diagnostics = []
    const faultyAssets = []
    const total = validations.length
    const fromBlock = await this.getFromBlock(options)

    for (let i = 0; i < total; i++) {
      const key = validations[i]

      log.info(`[${i + 1}/${total}]: Running ${key}`)
      const doctor = new doctors[key]()
      const diagnoses = await doctor.diagnose(options)

      if (diagnoses.hasProblems()) {
        faultyAssets.push(...diagnoses.getFaultyAssets())
      } else {
        continue
      }

      diagnostics.push(diagnoses)

      if (options.selfHeal) {
        log.info(`Preparing ${key} problems from block ${fromBlock}`)
        await diagnoses.prepare(fromBlock)
      }
    }

    if (options.selfHeal) {
      await this.selfHeal(diagnostics, faultyAssets, fromBlock)
    } else {
      log.info(`${faultyAssets.length} found`)

      faultyAssets.forEach(asset =>
        console.log(`Asset ${asset.id} with error: ${asset.error}`)
      )
      process.exit()
    }
  }

  getValidations(skip = '') {
    const skippedValidations = skip.toLowerCase().split(',')

    return Object.keys(doctors).filter(
      key => !skippedValidations.includes(key.toLowerCase())
    )
  }

  async selfHeal(diagnostics, faultyAssets, fromBlock) {
    if (diagnostics.length > 0) {
      log.info(
        `Attempting to heal problems. Re-fetching events from block ${fromBlock}`
      )

      // @nico Hack: change the command name so we can keep the flags but run the monitor
      process.argv = process.argv.map(arg => (arg === 'run' ? 'index' : arg))

      await indexMissingEvents(
        (...args) =>
          new SanitiyMonitorActions(
            { diagnostics, faultyAssets, fromBlock },
            ...args
          ),
        true
      )
    } else {
      log.info('Everything good. No differences found')
      process.exit()
    }
  }

  async getFromBlock(options) {
    if (options.fromBlock) {
      return Number(options.fromBlock)
    }

    if (options.blocksBehind) {
      const lastBlock = await eth.getBlockNumber()
      return lastBlock - Number(options.blocksBehind)
    }

    return 0
  }
}

class SanitiyMonitorActions extends MonitorActions {
  constructor(options, ...args) {
    super(...args)
    this.diagnostics = options.diagnostics
    this.faultyAssets = options.faultyAssets
    this.fromBlock = options.fromBlock
    this.delayedEvents = {}
  }

  async monitor(contractName, eventNames, options) {
    options.watch = false
    options.skipProcess = true

    const steps = parseInt(env.get('BLOCK_STEP', 50000), 10)

    const lastBlock = await eth.getBlockNumber()
    const times = (lastBlock - this.fromBlock) / steps + 1

    for (let i = 0; i < times; i++) {
      const fromBlock = steps * i + this.fromBlock

      // Stop the loop if last block is achieved
      if (fromBlock >= lastBlock) {
        continue
      }

      let toBlock = steps * (i + 1) + this.fromBlock
      // Set toBlock to latest if last block is achieved
      if (toBlock >= lastBlock) {
        toBlock = 'latest'
      }
      // loop eventNames
      const promises = []

      log.info(
        `[${contractName}] Getting events from ${fromBlock} to ${toBlock}`
      )

      for (let eventName of eventNames) {
        const key = this.getKey(contractName, eventName, fromBlock, toBlock)
        if (!this.delayedEvents[key]) {
          this.delayedEvents[key] = []
        }

        const numberTypeEvents = getCountOfEvents(contractName, eventName)

        for (let j = 0; j < numberTypeEvents; j++) {
          const promise = new Promise(res => this.delayedEvents[key].push(res))
          promises.push(promise)
        }
        super.monitor(contractName, [eventName], {
          ...options,
          fromBlock,
          toBlock
        })
        await Promise.all(promises)
      }
    }
  }

  processEvents() {
    log.info('Do nothing...')
    return Promise.resolve()
  }

  async _processEvents() {
    log.info('Replaying events for inconsistent data')

    // Create Estates in case they were not created by missing an event
    await this.createEstates()

    for (const diagnoses of this.diagnostics) {
      await diagnoses.doTreatment()
    }

    await this.updateTiles()

    log.info('All done!')
    process.exit()
  }

  async createEstates() {
    log.info('Creating Estates...')
    const createEstateEvents = await BlockchainEvent.find({
      name: eventNames.CreateEstate
    })

    await asyncBatch({
      elements: createEstateEvents,
      callback: async createEstateEventsBatch => {
        const createEventsPromises = createEstateEventsBatch.map(processEvent)
        await Promise.all(createEventsPromises)
      },
      batchSize: env.get('BATCH_SIZE'),
      retryAttempts: 20
    })
  }

  async updateTiles() {
    log.info('Tiles')

    log.info('Removing duplicates tiles')
    const singleAssets = {}
    const assets = []
    for (const asset of this.faultyAssets) {
      if (!singleAssets[asset.token_id]) {
        singleAssets[asset.token_id] = true

        const fixedAsset = await (isParcel(asset)
          ? Parcel.findOne({ id: asset.id })
          : Estate.findOne({ id: asset.id }))

        assets.push(fixedAsset)
      }
    }

    log.info('Updating tiles')
    await asyncBatch({
      elements: assets,
      callback: async assetsBatch => {
        const promises = assetsBatch.map(asset => {
          const assetType = isParcel(asset)
            ? ASSET_TYPES.parcel
            : ASSET_TYPES.estate
          return Tile.upsertAsset(asset, assetType)
        })
        await Promise.all(promises)
      },
      batchSize: env.get('BATCH_SIZE'),
      retryAttempts: 20
    })
  }

  async finish(options) {
    if (options.hasMonitorFinished) {
      await this._processEvents()
    } else {
      const fromBlock = options.fromBlock
      const toBlock = options.toBlock
      const key = this.getKey(
        options.contractName,
        options.eventName,
        fromBlock,
        toBlock
      )

      log.info(
        `[${options.contractName}] - ${
          options.eventName
        } Finished events from ${options.fromBlock} to ${options.toBlock}`
      )

      // Resolve promise and shift it
      if (this.delayedEvents[key]) {
        const resolve = this.delayedEvents[key].shift()
        resolve()
      }
    }
  }

  getKey(contractName, eventName, fromBlock, toBlock) {
    return `${contractName}-${eventName}-${fromBlock}-${toBlock}`
  }
}
