import { db, env } from 'decentraland-commons'

const connectCallbacks = []

export const database = {
  ...db.postgres,

  async connect() {
    const CONNECTION_STRING = env.get('CONNECTION_STRING')
    this.client = await db.postgres.connect(CONNECTION_STRING)

    for (const callback of connectCallbacks) {
      callback(this.client)
    }

    return this
  },

  async on(name, callback) {
    this.client.on('notification', msg => {
      if (msg.name === 'notification' && msg.channel === name) {
        callback(msg)
      }
    })
    return this.client.query(`LISTEN ${name}`)
  },

  async off(name) {
    return this.client.query(`UNLISTEN ${name}`)
  },

  onConnect(callback) {
    if (typeof callback === 'function') {
      connectCallbacks.push(callback)
    }
  }
}
