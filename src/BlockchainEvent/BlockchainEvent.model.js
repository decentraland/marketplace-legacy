import { env, Model } from 'decentraland-commons'
import { SQL } from '../database'
import { loadEnv } from '../../scripts/utils'

loadEnv()

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

  static landRegistryAddress = env.get('LAND_REGISTRY_CONTRACT_ADDRESS')
  static marketPlaceAddress = env.get('MARKETPLACE_CONTRACT_ADDRESS')
  static mortgageHelperAddress = env.get('MORTGAGE_HELPER_CONTRACT_ADDRESS')
  static rcnEngineAddress = env.get('RCN_ENGINE_CONTRACT_ADDRESS')
  static mortgageManagerAddress = env.get('MORTGAGE_MANAGER_CONTRACT_ADDRESS')
  static estateRegistryAddress = env.get('ESTATE_REGISTRY_CONTRACT_ADDRESS')

  static EVENTS = {
    publicationCreated: BlockchainEvent.getNormalizedEventName(
      BlockchainEvent.marketPlaceAddress,
      'AuctionCreated'
    ),
    publicationSuccessful: BlockchainEvent.getNormalizedEventName(
      BlockchainEvent.marketPlaceAddress,
      'AuctionSuccessful'
    ),
    publicationCancelled: BlockchainEvent.getNormalizedEventName(
      BlockchainEvent.marketPlaceAddress,
      'AuctionCancelled'
    ),
    parcelTransfer: BlockchainEvent.getNormalizedEventName(
      BlockchainEvent.landRegistryAddress,
      'Transfer'
    ),
    parcelUpdate: BlockchainEvent.getNormalizedEventName(
      BlockchainEvent.landRegistryAddress,
      'Update'
    ),
    parcelSetEstateRegistry: BlockchainEvent.getNormalizedEventName(
      BlockchainEvent.landRegistryAddress,
      'EstateRegistrySet'
    ),
    estateTransfer: BlockchainEvent.getNormalizedEventName(
      BlockchainEvent.estateRegistryAddress,
      'Transfer'
    ),
    estateUpdate: BlockchainEvent.getNormalizedEventName(
      BlockchainEvent.estateRegistryAddress,
      'Update'
    ),
    addLand: BlockchainEvent.getNormalizedEventName(
      BlockchainEvent.estateRegistryAddress,
      'AddLand'
    ),
    removeLand: BlockchainEvent.getNormalizedEventName(
      BlockchainEvent.estateRegistryAddress,
      'RemoveLand'
    ),
    estateCreate: BlockchainEvent.getNormalizedEventName(
      BlockchainEvent.estateRegistryAddress,
      'CreateEstate'
    ),
    newMortgage: BlockchainEvent.getNormalizedEventName(
      BlockchainEvent.mortgageHelperAddress,
      'NewMortgage'
    ),
    cancelledMortgage: BlockchainEvent.getNormalizedEventName(
      BlockchainEvent.mortgageManagerAddress,
      'CanceledMortgage'
    ),
    startedMortgage: BlockchainEvent.getNormalizedEventName(
      BlockchainEvent.mortgageManagerAddress,
      'StartedMortgage'
    ),
    paidMortgage: BlockchainEvent.getNormalizedEventName(
      BlockchainEvent.mortgageManagerAddress,
      'PaidMortgage'
    ),
    defaultedMortgage: BlockchainEvent.getNormalizedEventName(
      BlockchainEvent.mortgageManagerAddress,
      'DefaultedMortgage'
    ),
    partialPayment: BlockchainEvent.getNormalizedEventName(
      BlockchainEvent.rcnEngineAddress,
      'PartialPayment'
    ),
    totalPayment: BlockchainEvent.getNormalizedEventName(
      BlockchainEvent.rcnEngineAddress,
      'TotalPayment'
    )
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
    const { block_number } = await this.findOne(null, {
      block_number: 'DESC',
      log_index: 'DESC'
    })
    return block_number
  }

  static findFrom(blockNumber) {
    return this.db.query(
      SQL`SELECT *
        FROM ${SQL.raw(this.tableName)}
        WHERE block_number > ${blockNumber}
        ORDER BY block_number ASC, log_index ASC`
    )
  }

  static findByAssetId(assetId) {
    return this.db.query(
      SQL`SELECT *
        FROM ${SQL.raw(this.tableName)}
        WHERE args->>'assetId' = ${assetId}
        ORDER BY block_number DESC, log_index DESC`
    )
  }

  static deleteByAssetId(assetId) {
    return this.db.query(
      SQL`DELETE FROM ${SQL.raw(this.tableName)}
        WHERE args->>'assetId' = ${assetId}`
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
}
