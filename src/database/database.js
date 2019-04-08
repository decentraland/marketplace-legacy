import { db, env, utils } from 'decentraland-commons'

const connectCallbacks = []

export const database = {
  ...db.postgres,

  async connect() {
    const CONNECTION_STRING = env.get('CONNECTION_STRING')
    this.client = await db.postgres.connect(CONNECTION_STRING)

    this.client.once('error', async () => {
      // We don't care If the ending the connection fails, it ussualy means it was already closed
      try {
        await this.client.end()
      } catch (error) {
        // Ignore socket errors
      }
      await this.reconnect()
    })

    for (const callback of connectCallbacks) {
      callback()
    }

    return this
  },

  async reconnect() {
    const timeout = env.get('DATABASE_RECONNECTION_TIMEOUT', 3000)
    console.log(`Database connection ended, waiting ${timeout}ms to retry`)

    await utils.sleep(Number(timeout))
    return this.connect()
      .then(() => console.log('Database reconnection successfull'))
      .catch(() => this.reconnect())
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
