import { env } from 'decentraland-commons'
import Sequelize from 'sequelize'

const CONNECTION_STRING = env.get('CONNECTION_STRING')
const DATABASE_LOGGING = env.get('DATABASE_LOGGING')

export const db = new Sequelize(CONNECTION_STRING, {
  operatorsAliases: false,
  logging: DATABASE_LOGGING === 'true' ? console.log : false,
  define: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
  pool: {
    max: 30,
    min: 0,
    acquire: 60000
  },
  query: { raw: true }
})

export const ColumnTypes = Sequelize
export const Op = Sequelize.Op
export const QueryTypes = db.QueryTypes

export function truncateTable(tableName, options = {}) {
  const model = Object.values(db.models).find(
    model => model.tableName === tableName
  )
  return model.truncate(options)
}

export function queryDatabase(query, options = { type: QueryTypes.SELECT }) {
  return db.query(query, options)
}

export async function connectDatabase() {
  await db.authenticate()

  for (const model of Object.values(db.models)) {
    if (typeof model.afterConnect === 'function') {
      model.afterConnect()
    }
  }

  return db
}

export function closeDatabase() {
  return db.close()
}
