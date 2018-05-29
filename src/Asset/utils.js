import { SQL } from '../database'
import { PublicationQueries } from '../Publication'

export const getFindByOwnerQuery = async (owner, table) =>
  table === 'estates'
    ? SQL`SELECT ${SQL.raw(table)}.*
         FROM ${SQL.raw(table)}
         WHERE owner = ${owner}`
    : SQL`SELECT ${SQL.raw(table)}.*, (
         ${PublicationQueries.findLastParcelPublicationJsonSql()}
       ) as publication
         FROM ${SQL.raw(table)}
         WHERE owner = ${owner}`
