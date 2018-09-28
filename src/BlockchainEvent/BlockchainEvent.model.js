import { env, Model } from 'decentraland-commons'
import { BlockchainEventQueries } from './BlockchainEvent.queries'
import { SQL } from '../database'

export class BlockchainEvent extends Model {
  static tableName = 'blockchain_events'
  static primaryKey = 'tx_hash'
  static columnNames = [
    'tx_hash',
    'name',
    'block_number',
    'log_index',
    'args',
    'address'
  ]

  static getEvents() {
    const landRegistryAddress = env.get('LAND_REGISTRY_CONTRACT_ADDRESS')
    const marketPlaceAddress = env.get('LEGACY_MARKETPLACE_CONTRACT_ADDRESS')
    const mortgageHelperAddress = env.get('MORTGAGE_HELPER_CONTRACT_ADDRESS')
    const rcnEngineAddress = env.get('RCN_ENGINE_CONTRACT_ADDRESS')
    const mortgageManagerAddress = env.get('MORTGAGE_MANAGER_CONTRACT_ADDRESS')
    const estateRegistryAddress = env.get('ESTATE_REGISTRY_CONTRACT_ADDRESS')

    return {
      publicationCreated: BlockchainEvent.getNormalizedEventName(
        marketPlaceAddress,
        'AuctionCreated'
      ),
      publicationSuccessful: BlockchainEvent.getNormalizedEventName(
        marketPlaceAddress,
        'AuctionSuccessful'
      ),
      publicationCancelled: BlockchainEvent.getNormalizedEventName(
        marketPlaceAddress,
        'AuctionCancelled'
      ),
      parcelTransfer: BlockchainEvent.getNormalizedEventName(
        landRegistryAddress,
        'Transfer'
      ),
      parcelUpdate: BlockchainEvent.getNormalizedEventName(
        landRegistryAddress,
        'Update'
      ),
      estateTransfer: BlockchainEvent.getNormalizedEventName(
        estateRegistryAddress,
        'Transfer'
      ),
      estateUpdate: BlockchainEvent.getNormalizedEventName(
        estateRegistryAddress,
        'Update'
      ),
      addLand: BlockchainEvent.getNormalizedEventName(
        estateRegistryAddress,
        'AddLand'
      ),
      removeLand: BlockchainEvent.getNormalizedEventName(
        estateRegistryAddress,
        'RemoveLand'
      ),
      estateCreate: BlockchainEvent.getNormalizedEventName(
        estateRegistryAddress,
        'CreateEstate'
      ),
      newMortgage: BlockchainEvent.getNormalizedEventName(
        mortgageHelperAddress,
        'NewMortgage'
      ),
      cancelledMortgage: BlockchainEvent.getNormalizedEventName(
        mortgageManagerAddress,
        'CanceledMortgage'
      ),
      startedMortgage: BlockchainEvent.getNormalizedEventName(
        mortgageManagerAddress,
        'StartedMortgage'
      ),
      paidMortgage: BlockchainEvent.getNormalizedEventName(
        mortgageManagerAddress,
        'PaidMortgage'
      ),
      defaultedMortgage: BlockchainEvent.getNormalizedEventName(
        mortgageManagerAddress,
        'DefaultedMortgage'
      ),
      partialPayment: BlockchainEvent.getNormalizedEventName(
        rcnEngineAddress,
        'PartialPayment'
      ),
      totalPayment: BlockchainEvent.getNormalizedEventName(
        rcnEngineAddress,
        'TotalPayment'
      )
    }
  }

  static async insertWithoutConflicts(blockchainEvent) {
    const now = new Date()

    blockchainEvent.created_at = now
    blockchainEvent.updated_at = now

    const values = Object.values(blockchainEvent)

    return this.db.query(
      `INSERT INTO ${this.tableName}(
       ${this.db.toColumnFields(blockchainEvent)}
      ) VALUES(
       ${this.db.toValuePlaceholders(blockchainEvent)}
      ) ON CONFLICT (tx_hash, log_index) DO NOTHING;`,
      values
    )
  }

  static async findLastBlockNumber() {
    const blockchainEvent = await this.findOne(null, {
      block_number: 'DESC',
      log_index: 'DESC'
    })

    return blockchainEvent ? blockchainEvent.block_number : 0
  }

  static findFrom(blockNumber) {
    return this.db.query(
      SQL`SELECT *
        FROM ${SQL.raw(this.tableName)}
        WHERE block_number > ${blockNumber}
        ORDER BY block_number ASC, log_index ASC`
    )
  }

  static findByArgs(argName, assetId) {
    return this.db.query(
      SQL`SELECT *
        FROM ${SQL.raw(this.tableName)}
        WHERE ${BlockchainEventQueries.byArgs(argName, assetId)}
        ORDER BY block_number ASC, log_index ASC`
    )
  }

  static deleteByArgs(argName, assetId) {
    return this.db.query(
      SQL`DELETE FROM ${SQL.raw(this.tableName)}
        WHERE ${BlockchainEventQueries.byArgs(argName, assetId)}`
    )
  }

  static normalizeEvent(event) {
    return {
      ...event,
      normalizedName: this.getNormalizedEventName(event.address, event.name)
    }
  }

  static getNormalizedEventName(address, name) {
    return `${address}-${name}`
  }

  static getEventName(event) {
    return event.split('-')[1]
  }
}
