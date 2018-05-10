import { db, ColumnTypes } from '../database'

export const BlockTimestamp = db.define('block_timestamp', {
  block_number: { type: ColumnTypes.INTEGER, primaryKey: true },
  timestamp: ColumnTypes.BIGINT
})

Object.assign(BlockTimestamp, {
  async findTimestamp(block_number) {
    const blockTimestamp = await this.findOne({
      where: { block_number }
    })
    return blockTimestamp ? blockTimestamp.timestamp : null
  }
})
