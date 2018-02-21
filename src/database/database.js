import { db, env } from 'decentraland-commons'

export const database = {
  ...db.postgres,

  async connect() {
    const CONNECTION_STRING = env.get('CONNECTION_STRING')
    this.client = await db.postgres.connect(CONNECTION_STRING)
    return this
  }
}
