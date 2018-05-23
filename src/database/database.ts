import { db, env, Db } from 'decentraland-commons'

export const database: Db['postgres'] = Object.assign({}, db.postgres, {
  async connect() {
    const CONNECTION_STRING = env.get('CONNECTION_STRING', null)
    this.client = await db.postgres.connect(CONNECTION_STRING)
    return this
  }
})
