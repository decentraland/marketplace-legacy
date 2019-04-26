import { db } from 'decentraland-server'
import { env, utils } from 'decentraland-commons'

const pg = db.clients.postgres
const connectCallbacks = []

export const database = Object.create(pg)

database.connect = async function() {
  const CONNECTION_STRING = env.get('CONNECTION_STRING')
  await pg.connect(CONNECTION_STRING)

  this.client = pg.client

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
}

database.reconnect = async function() {
  const timeout = env.get('DATABASE_RECONNECTION_TIMEOUT', 3000)
  console.log(`Database connection ended, waiting ${timeout}ms to retry`)

  await utils.sleep(Number(timeout))
  return this.connect()
    .then(() => console.log('Database reconnection successfull'))
    .catch(() => this.reconnect())
}

database.on = async function(name, callback) {
  this.client.on('notification', msg => {
    if (msg.name === 'notification' && msg.channel === name) {
      callback(msg)
    }
  })
  return this.client.query(`LISTEN ${name}`)
}

database.off = async function(name) {
  return this.client.query(`UNLISTEN ${name}`)
}

database.onConnect = function(callback) {
  if (typeof callback === 'function') {
    connectCallbacks.push(callback)
  }
}
