import { Model } from 'decentraland-commons'

export class BlockTimestamp extends Model {
  static tableName = 'block_timestamps'
  static columnNames = ['block_number', 'timestamp']
  static primaryKey = 'block_number'

  static async findTimestamp(block_number) {
    const blockTimestamp = await this.find({ block_number }, null, 'LIMIT 1')
    return blockTimestamp.length ? blockTimestamp[0].timestamp : null
  }
}
