import { db, env } from 'decentraland-commons'

export default {
  ...db.postgres,

  async connect() {
    const CONNECTION_STRING = env.get('CONNECTION_STRING')

    this.client = await db.postgres.connect(CONNECTION_STRING)

    await this.createSchema()

    return this
  },

  async createSchema() {
    await this.createTable('table_name', ``)
    await this.createIndex('table_name', 'index_name', ['column_name'])
  }
}
