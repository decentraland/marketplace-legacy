import { Mortgage } from './Mortgage.model'
import { Parcel } from '../Parcel'
import { Publication } from '../Publication'
import { SQL, raw } from '../database'

export const MortgageQueries = Object.freeze({
  findLastByBorrowerSql: borrower =>
    SQL`SELECT row_to_json(m.*)
      FROM ${raw(Mortgage.tableName)} as m
      WHERE borrower = ${borrower}
        AND m.asset_id = ${raw(Parcel.tableName)}.id
        AND m.status != ${Mortgage.STATUS.cancelled}
        AND EXISTS (
          SELECT * FROM ${raw(Publication.tableName)} as p
          WHERE m.asset_id = p.asset_id
        )
      ORDER BY m.created_at DESC LIMIT 1`
})
