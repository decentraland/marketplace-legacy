import { Mortgage } from './Mortgage.model'
import { Parcel } from '../Parcel'
import { SQL, raw } from '../database'

export const MortgageQueries = Object.freeze({
  findByBorrowerSql: borrower =>
    SQL`SELECT row_to_json(m.*)
      FROM ${raw(Mortgage.tableName)} as m
      WHERE borrower = ${borrower}
        AND m.x = ${raw(Parcel.tableName)}.x
        AND m.y = ${raw(Parcel.tableName)}.y
        AND m.status != ${Mortgage.STATUS.cancelled}
      ORDER BY m.created_at DESC LIMIT 1`,

  findParcelMortgageJsonSql: () =>
    SQL`SELECT row_to_json(m.*)
      FROM ${raw(Mortgage.tableName)} as m
      WHERE m.x = ${raw(Parcel.tableName)}.x
        AND m.y = ${raw(Parcel.tableName)}.y
      ORDER BY m.created_at DESC`
})
