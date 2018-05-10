import { coordinates } from './coordinates'
import {
  db,
  queryDatabase,
  QueryBuilder,
  QueryTypes,
  ColumnTypes,
  Op
} from '../database'
import { Publication } from '../Publication'
import { District } from '../District'

export const Parcel = db.define('parcel', {
  id: { type: ColumnTypes.TEXT, primaryKey: true },
  x: { type: ColumnTypes.INTEGER, allowNull: false },
  y: { type: ColumnTypes.INTEGER, allowNull: false },
  asset_id: ColumnTypes.TEXT,
  auction_price: ColumnTypes.TEXT,
  auction_owner: ColumnTypes.TEXT,
  owner: ColumnTypes.STRING(42),
  district_id: ColumnTypes.TEXT,
  data: ColumnTypes.JSON,
  tags: ColumnTypes.JSON,
  last_transferred_at: ColumnTypes.BIGINT
})

Parcel.hook('beforeValidate', (parcel, options) => {
  if (parcel.x != null && parcel.y != null) {
    parcel.id = Parcel.buildId(parcel.x, parcel.y)
  }
})

Object.assign(Parcel, {
  afterConnect() {
    Parcel.belongsTo(Publication, {
      foreignKey: 'x',
      targetKey: 'x',
      scope: QueryBuilder.buildWhereColsAreEqual(Parcel, Publication, 'y')
    })
    Parcel.belongsTo(District, { foreignKey: 'district_id' })
  },
  buildId: function(x, y) {
    if (x == null || y == null) {
      throw new Error(
        `You need to supply both coordinates to be able to hash them. x = ${x} y = ${y}`
      )
    }

    return `${x},${y}`
  },
  splitId: function(id = '') {
    const coordinates = id.split(',')

    if (coordinates.length !== 2) {
      throw new Error(`You need to supply a valid id to split. id = ${id}`)
    }

    return coordinates
  },
  findByOwner(owner) {
    return this.findAll({
      attributes: {
        include: db.literal(
          `(${Publication.findLastParcelPublicationJsonSQL()})`
        )
      },
      where: { owner }
    })
  },
  findByOwnerAndStatus(owner, status) {
    return queryDatabase(
      `SELECT DISTINCT ON(par.id, pub.status) par.*, row_to_json(pub.*) as publication
        FROM ${this.tableName} as par
        LEFT JOIN (
          ${Publication.findPublicationsByStatusSql(status)}
        ) as pub ON par.x = pub.x AND par.y = pub.y
        WHERE par.owner = :owner
          AND pub.tx_hash IS NOT NULL`,
      { type: QueryTypes.SELECT, replacements: { owner } }
    )
  },
  findOwneableParcels(options = {}) {
    return this.findAll({
      where: { district_id: null },
      ...options
    })
  },
  findLandmarks(options = {}) {
    return this.findAll({
      where: { district_id: { [Op.ne]: null } },
      ...options
    })
  },
  inRange(min, max) {
    const [minx, miny] = coordinates.toArray(min)
    const [maxx, maxy] = coordinates.toArray(max)

    return this.findAll({
      attributes: {
        include: db.literal(
          `(${Publication.findLastParcelPublicationJsonSQL()})`
        )
      },
      where: {
        x: { [Op.between]: [minx, maxx] },
        y: { [Op.between]: [miny, maxy] }
      }
    })
  },
  async encodeAssetId(x, y) {
    const row = await this.findOne({
      attributes: ['asset_id'],
      where: { x, y }
    })
    return row ? row.asset_id : null
  },
  async decodeAssetId(asset_id) {
    const row = await this.findOne({
      attributes: ['id'],
      where: { asset_id }
    })
    return row ? row.id : null
  }
})

Object.assign(Parcel.prototype, {
  isEqual: function(parcel) {
    return this.id === parcel.id || (this.x === parcel.x && this.y === parcel.y)
  },
  distanceTo: function(parcel) {
    // Chebyshev distance
    return Math.max(Math.abs(this.x - parcel.x), Math.abs(this.y - parcel.y))
  },
  isWithinBoundingBox: function(parcel, size) {
    return (
      Math.abs(this.x - parcel.x) <= size && Math.abs(this.y - parcel.y) <= size
    )
  },
  isPlaza: function() {
    return District.isPlaza(this.district_id)
  },
  isRoad: function() {
    return District.isRoad(this.district_id)
  }
})
