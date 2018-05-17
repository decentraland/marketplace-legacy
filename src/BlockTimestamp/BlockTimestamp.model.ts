import { Model } from 'decentraland-commons'

export interface BlockTimestampAttributes {
  block_number: number
  timestamp: number
}

export class BlockTimestamp extends Model {
  static tableName = 'block_timestamps'
  static primaryKey = 'block_number'
  static columnNames = ['block_number', 'timestamp']

  static async findTimestamp(block_number: number): Promise<number> {
    const blockTimestamp = await this.find({ block_number }, null, 'LIMIT 1')
    return blockTimestamp.length ? blockTimestamp[0].timestamp : null
  }
}
