import { Model } from 'decentraland-commons'

class ParcelState extends Model {
  static tableName = 'parcel_states'
  static columnNames = [
    'id',
    'x',
    'y',
    'amount',
    'address',
    'endsAt',
    'bidGroupId',
    'bidIndex',
    'projectId'
  ]

  static hashId(x, y) {
    if (x == null || y == null) {
      throw new Error(
        `You need to supply both coordinates to be able to hash them. x = ${x} y = ${y}`
      )
    }

    return `${x},${y}`
  }

  static findByCoordinate(x, y) {
    return this.db.query(
      `SELECT *
        FROM ${this.tableName}
        WHERE x = $1 AND y = $2`,
      [x, y]
    )
  }

  static async insert(parcelState) {
    const { x, y } = parcelState
    parcelState.id = ParcelState.hashId(x, y)

    return await super.insert(parcelState)
  }
}

export default ParcelState
