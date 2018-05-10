import { db, ColumnTypes } from '../database'
import uuid from 'uuid'
import { Contribution } from '../Contribution'
import { Parcel } from '../Parcel'

export const ROADS_ID = 'f77140f9-c7b4-4787-89c9-9fa0e219b079'
export const PLAZA_ID = '55327350-d9f0-4cae-b0f3-8745a0431099'

export const District = db.define('district', {
  id: { type: ColumnTypes.STRING, primaryKey: true },
  name: ColumnTypes.STRING,
  description: ColumnTypes.STRING,
  link: ColumnTypes.STRING,
  public: { type: ColumnTypes.BOOLEAN, defaultValue: true, allowNull: false },
  parcel_count: ColumnTypes.INTEGER,
  parcel_ids: ColumnTypes.ARRAY(ColumnTypes.TEXT),
  priority: ColumnTypes.INTEGER,
  center: ColumnTypes.TEXT,
  disabled: { type: ColumnTypes.BOOLEAN, defaultValue: false, allowNull: false }
})

District.hook('beforeValidate', (district, options) => {
  district.id = district.id || uuid.v4()
})

Object.assign(District, {
  afterConnect() {
    District.hasMany(Parcel, { foreignKey: 'district_id' })
    District.hasMany(Contribution, { foreignKey: 'district_id' })
  },
  isRoad(id) {
    return ROADS_ID === id
  },
  isPlaza(id) {
    return PLAZA_ID === id
  },
  findEnabled() {
    return this.findAll({ where: { disabled: false } })
  },
  findByName(name) {
    return this.findOne({ where: { name } })
  }
})
