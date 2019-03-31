import http from 'http'
import express from 'express'
import bodyParser from 'body-parser'
import { env } from 'decentraland-commons'

import { db } from './database'
import { AssetRouter, ParcelRouter, EstateRouter } from './Asset'
import { MortgageRouter } from './Mortgage'
import { DistrictRouter } from './District'
import { ContributionRouter } from './Contribution'
import { TileRouter } from './Tile'
import { TranslationRouter } from './Translation'
import { MapRouter } from './Map'
import { MarketplaceRouter } from './Marketplace'
import { InviteRouter } from './Invite'
import { BidRouter, PublicationRouter } from './Listing'
import { AuthorizationRouter } from './Authorization'

const SERVER_PORT = env.get('SERVER_PORT', 5000)
const CORS_ORIGIN = env.get('CORS_ORIGIN', '*')
const CORS_METHOD = env.get('CORS_METHOD', '*')

const app = express()
const httpServer = http.Server(app)

app.use(bodyParser.urlencoded({ extended: false, limit: '2mb' }))
app.use(bodyParser.json())
app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', CORS_ORIGIN)
  res.setHeader('Access-Control-Request-Method', CORS_METHOD)
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, DELETE'
  )
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  next()
})

if (!env.isDevelopment()) {
  // This is not ideal, but adding newrelic to development is worst
  require('newrelic')
}

// Set base URL for API to v1
const router = new express.Router()
app.use('/v1', router)

/* Start the server only if run directly */
if (require.main === module) {
  startServer().catch(console.error)
}

export async function startServer() {
  console.log('Connecting database')
  await db.connect()

  new AssetRouter(router).mount()
  new EstateRouter(router).mount()
  new MortgageRouter(router).mount()
  new DistrictRouter(router).mount()
  new ContributionRouter(router).mount()
  new PublicationRouter(router).mount()
  new TileRouter(router).mount()
  new TranslationRouter(router).mount()
  new MapRouter(router).mount()
  new MarketplaceRouter(router).mount()
  new ParcelRouter(router).mount()
  new InviteRouter(router).mount()
  new BidRouter(router).mount()
  new AuthorizationRouter(router).mount()

  return httpServer.listen(SERVER_PORT, () =>
    console.log('Server running on port', SERVER_PORT)
  )
}
