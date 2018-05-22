import { Mortgage } from './Mortgage.model'
import { Parcel } from '../Parcel'
import { SQL, raw } from '../database'

export const MortgageQueries = Object.freeze({
  findLastByBorrowerSql: borrower =>
    SQL`SELECT row_to_json(m.*)
      FROM ${raw(Mortgage.tableName)} as m
      WHERE borrower = ${borrower}
        AND m.asset_id = ${raw(Parcel.tableName)}.id
        AND m.status != ${Mortgage.STATUS.cancelled}
      ORDER BY m.created_at DESC LIMIT 1`,

  findParcelMortgageJsonSql: () =>
    SQL`SELECT row_to_json(m.*)
      FROM ${raw(Mortgage.tableName)} as m
      WHERE m.asset_id = ${raw(Parcel.tableName)}.id
      ORDER BY m.created_at DESC`
})
