import { db, env, Db } from 'decentraland-commons'

export const database: Db['postgres'] = {
  async connect() {
    const CONNECTION_STRING = env.get('CONNECTION_STRING')
    this.client = await db.postgres.connect(CONNECTION_STRING)
    return this
  },
  query(queryString, values) {
    return db.postgres.query(queryString, values)
  },
  truncate(tableName: string) {
    return db.postgres.truncate(tableName)
  },
  close() {
    return db.postgres.close()
  }
}
