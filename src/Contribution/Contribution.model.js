import { db, ColumnTypes } from '../database'
import { District } from '../District'

export const Contribution = db.define('contribution', {
  address: { type: ColumnTypes.STRING(42), allowNull: false },
  district_id: { type: ColumnTypes.STRING(36), allowNull: false },
  land_count: { type: ColumnTypes.INTEGER, allowNull: false },
  timestamp: { type: ColumnTypes.STRING(20), allowNull: false },
  message: ColumnTypes.BLOB,
  signature: ColumnTypes.BLOB
})

Object.assign(Contribution, {
  afterConnect() {
    Contribution.belongsTo(District, { oreignKey: 'district_id' })
  },
  findByAddress(address) {
    return this.findAll({ where: { address } })
  },
  findGroupedByAddress(address, options = {}) {
    return this.findAll({
      attributes: [
        'address',
        'district_id',
        [db.fn('SUM', db.col('land_count')), 'land_count']
      ],
      where: { address },
      group: ['address', 'district_id']
    })
  }
})
