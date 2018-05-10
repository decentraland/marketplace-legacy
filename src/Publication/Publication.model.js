import { txUtils } from 'decentraland-eth'
import { db, QueryBuilder, ColumnTypes, Op } from '../database'
import { BlockchainEvent } from '../BlockchainEvent'
import { PublicationQueryBuilder } from './Publication.querybuilder'
import { Parcel } from '../Parcel'

const STATUS = Object.freeze({
  open: 'open',
  sold: 'sold',
  cancelled: 'cancelled'
})

export const Publication = db.define('publication', {
  tx_hash: { type: ColumnTypes.TEXT, primaryKey: true },
  contract_id: { type: ColumnTypes.TEXT, unique: true, allowNull: false },
  tx_status: {
    type: ColumnTypes.TEXT,
    allowNull: false,
    defaultValue: txUtils.TRANSACTION_STATUS.pending,
    validate: {
      isIn: [Object.values(txUtils.TRANSACTION_STATUS)]
    }
  },
  block_number: { type: ColumnTypes.INTEGER, allowNull: false },
  status: {
    type: ColumnTypes.TEXT,
    allowNull: false,
    defaultValue: STATUS.open,
    validate: {
      isIn: [Object.values(STATUS)]
    }
  },
  x: { type: ColumnTypes.INTEGER, allowNull: false },
  y: { type: ColumnTypes.INTEGER, allowNull: false },
  owner: { type: ColumnTypes.STRING(42), allowNull: false },
  buyer: ColumnTypes.STRING(42),
  price: { type: ColumnTypes.FLOAT, allowNull: false },
  expires_at: ColumnTypes.BIGINT,
  block_time_created_at: ColumnTypes.BIGINT,
  block_time_updated_at: ColumnTypes.BIGINT
})

Publication.STATUS = STATUS

Object.assign(Publication, {
  afterConnect() {
    Publication.belongsTo(BlockchainEvent, {
      foreignKey: 'tx_hash'
    })
    Publication.belongsTo(Parcel, {
      foreignKey: 'x',
      targetKey: 'x',
      scope: QueryBuilder.buildWhereColsAreEqual(Publication, Parcel, 'y')
    })
  },
  isValidStatus(status) {
    return Object.values(STATUS).includes(status)
  },
  findInCoordinate(x, y) {
    return this.findAll({
      where: { x, y },
      order: [['created_at', 'DESC']]
    })
  },
  findInCoordinateWithStatus(x, y, status) {
    if (!Publication.isValidStatus(status)) {
      throw new Error(`Invalid status '${status}'`)
    }
    return this.findAll({
      where: { x, y, status },
      order: [['created_at', 'DESC']]
    })
  },
  findPublicationsByStatusSql(status = null) {
    if (!this.isValidStatus(status)) {
      throw new Error(`Invalid status '${status}'`)
    }

    const where = new PublicationQueryBuilder()
      .assign({ status })
      .isActive()
      .build()

    return QueryBuilder.buildSelectSQL(Publication, {
      where,
      order: [['created_at', 'DESC']]
    })
  },
  findLastParcelPublicationJsonSQL() {
    const where = new PublicationQueryBuilder()
      .whereColsAreEqual(Publication, Parcel, 'x')
      .whereColsAreEqual(Publication, Parcel, 'y')
      .isActive()
      .build()

    return QueryBuilder.buildSelectSQL(Publication, {
      attributes: [QueryBuilder.buildRowToJsonAttribute(Publication)],
      where,
      order: [['created_at', 'DESC']],
      limit: 1
    })
  },
  async cancelOlder(x, y, block_number) {
    const rows = await this.findAll({
      attributes: ['tx_hash'],
      where: {
        x,
        y,
        status: this.STATUS.open,
        [`$${BlockchainEvent.name}.block_number$`]: {
          [Op.lt]: block_number
        }
      },
      include: [
        {
          model: BlockchainEvent,
          attributes: [],
          where: { name: BlockchainEvent.EVENTS.publicationCreated }
        }
      ],
      raw: true
    })

    const txHashes = rows.map(row => row.tx_hash)

    if (txHashes.length) {
      await this.updateManyStatus(txHashes, STATUS.cancelled)
    }
  },
  updateManyStatus(txHashes, newStatus) {
    if (txHashes.length === 0) {
      return []
    }
    if (!this.isValidStatus(newStatus)) {
      throw new Error(`Trying to filter by invalid status '${newStatus}'`)
    }

    return Publication.update(
      { status: newStatus },
      { where: { tx_hash: { [Op.in]: txHashes } } }
    )
  }
})
