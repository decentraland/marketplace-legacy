import http from 'http'
import express from 'express'
import bodyParser from 'body-parser'

import { eth, contracts } from 'decentraland-eth'
import { env } from 'decentraland-commons'

import { db } from './database'
import { ParcelRoutes } from './Parcel'
import { StateRoutes } from './State'
import { DistrictRoutes } from './District'
import { ContributionRoutes } from './Contribution'
import { PublicationRoutes } from './Publication'
import { TranslationRoutes } from './Translation'

env.load()

const SERVER_PORT = env.get('SERVER_PORT', 5000)

const app = express()
const httpServer = http.Server(app)

app.use(bodyParser.urlencoded({ extended: false, limit: '2mb' }))
app.use(bodyParser.json())

if (env.isDevelopment()) {
  app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Request-Method', '*')
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, DELETE'
    )
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    next()
  })
} else {
  // This is not ideal, but adding newrelic to development is worst
  require('newrelic')
}

new TranslationRoutes(app).mount()
new PublicationRoutes(app).mount()
new ParcelRoutes(app).mount()
new StateRoutes(app).mount()
new DistrictRoutes(app).mount()
new ContributionRoutes(app).mount()

/* Start the server only if run directly */
if (require.main === module) {
  startServer().catch(console.error)
}

async function startServer() {
  console.log('Connecting database')
  await db.connect()

  console.log('Connecting to Ethereum node')
  await eth
    .connect({
      contracts: [
        new contracts.LANDRegistry(env.get('LAND_REGISTRY_CONTRACT_ADDRESS'))
      ],
      provider: env.get('RPC_URL') // default to localhost
    })
    .catch(error =>
      console.error(
        '\nCould not connect to the Ethereum node. Some endpoints may not work correctly.',
        '\nMake sure you have a node running on port 8545.',
        `\nError: "${error.message}"\n`
      )
    )

  return httpServer.listen(SERVER_PORT, () =>
    console.log('Server running on port', SERVER_PORT)
  )
}
