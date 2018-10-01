import { Parcel, Estate } from '../src/Asset'
import { BlockchainEvent } from '../src/BlockchainEvent'

const estateTableName = Estate.tableName
const parcelTableName = Parcel.tableName
const blockchainTableName = BlockchainEvent.tableName

exports.up = pgm => {
  pgm.addColumns(estateTableName, {
    tx_hash: { type: 'TEXT', unique: true, notNull: true },
    asset_id: { type: 'TEXT', notNull: true, unique: true }
  })

  pgm.createIndex(estateTableName, 'asset_id')
  pgm.createIndex(estateTableName, 'owner')

  pgm.addColumns(parcelTableName, {
    estate_id: { type: 'TEXT' }
  })

  pgm.addColumns(blockchainTableName, {
    address: { type: 'TEXT', notNull: true }
  })

  pgm.dropColumns(parcelTableName, {
    in_estate: { type: 'BOOLEAN', default: false, allowNull: false }
  })
}

exports.down = pgm => {
  pgm.dropIndex(estateTableName, 'asset_id')
  pgm.dropIndex(estateTableName, 'owner')

  pgm.dropColumns(estateTableName, {
    tx_hash: { type: 'TEXT' },
    asset_id: { type: 'TEXT' }
  })

  pgm.dropColumns(parcelTableName, {
    estate_id: { type: 'TEXT' }
  })

  pgm.dropColumns(blockchainTableName, {
    address: { type: 'TEXT', notNull: true }
  })

  pgm.addColumns(parcelTableName, {
    in_estate: { type: 'BOOLEAN', default: false, allowNull: false }
  })
}
