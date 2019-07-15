import { BlockchainEvent } from '../src/BlockchainEvent'

const tableName = BlockchainEvent.tableName

exports.up = pgm => {
  pgm.createIndex(tableName, "(args->>'assetId')", { method: 'BTREE' })
  pgm.createIndex(tableName, "(args->>'landId')", { method: 'BTREE' })
  pgm.createIndex(tableName, "(args->>'tokenId')", { method: 'BTREE' })
  pgm.createIndex(tableName, "(args->>'_landId')", { method: 'BTREE' })
  pgm.createIndex(tableName, "(args->>'_tokenId')", { method: 'BTREE' })
  pgm.createIndex(tableName, "(args->>'_estateId')", { method: 'BTREE' })
  pgm.createIndex(tableName, "(args->>'_assetId')", { method: 'BTREE' })
  pgm.createIndex(tableName, 'name')
}
