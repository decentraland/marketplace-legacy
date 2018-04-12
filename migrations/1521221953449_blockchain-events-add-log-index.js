import { BlockchainEvent } from '../src/BlockchainEvent'

const tableName = BlockchainEvent.tableName

exports.up = pgm => {
  pgm.dropConstraint(tableName, 'blockchain_events_pkey')

  pgm.addColumns(tableName, {
    log_index: {
      type: 'int',
      notNull: true
    }
  })

  pgm.addConstraint(
    tableName,
    'blockchain_events_pkey',
    'PRIMARY KEY (tx_hash, log_index)'
  )
}

exports.down = pgm => {
  pgm.dropConstraint(tableName, 'blockchain_events_pkey')

  pgm.dropColumns(tableName, ['log_index'])

  pgm.addConstraint(
    tableName,
    'blockchain_events_pkey',
    'PRIMARY KEY (tx_hash, name)'
  )
}
