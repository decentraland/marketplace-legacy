import http from 'http'
import express from 'express'
import bodyParser from 'body-parser'
import { env } from 'decentraland-commons'

import { db } from './database'
import { AssetRouter, ParcelRouter, EstateRouter } from './Asset'
import { MortgageRouter } from './Mortgage'
import { DistrictRouter } from './District'
import { ContributionRouter } from './Contribution'
import { PublicationRouter } from './Publication'
import { TranslationRouter } from './Translation'
import { MapRouter } from './Map'
import { MarketplaceRouter } from './Marketplace'

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

// Set base URL for API to v1
const router = new express.Router()
app.use('/v1', router)

new AssetRouter(router).mount()
new EstateRouter(router).mount()
new MortgageRouter(router).mount()
new DistrictRouter(router).mount()
new ContributionRouter(router).mount()
new PublicationRouter(router).mount()
new TranslationRouter(router).mount()
new MapRouter(router).mount()
new MarketplaceRouter(router).mount()
new ParcelRouter(router).mount()

/* Start the server only if run directly */
if (require.main === module) {
  startServer().catch(console.error)
}

async function startServer() {
  console.log('Connecting database')
  await db.connect()

  return httpServer.listen(SERVER_PORT, () =>
    console.log('Server running on port', SERVER_PORT)
  )
}
