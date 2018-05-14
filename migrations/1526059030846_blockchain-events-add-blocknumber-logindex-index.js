import { BlockchainEvent } from '../src/BlockchainEvent'

const tableName = BlockchainEvent.tableName

exports.up = pgm => {
  pgm.createIndex(tableName, ['block_number', 'log_index'])
}

exports.down = pgm => {
  pgm.dropIndex(tableName, ['block_number', 'log_index'])
}
