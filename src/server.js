import http from 'http'
import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import { server, env } from 'decentraland-commons'

import db from './db'
import { District } from './District'
import { Parcel, ParcelService } from './Parcel'

env.load()

const SERVER_PORT = env.get('SERVER_PORT', 5000)

const app = express()
const httpServer = http.Server(app)

app.use(bodyParser.urlencoded({ extended: false, limit: '2mb' }))
app.use(bodyParser.json())

if (env.isProduction()) {
  const webappPath = env.get(
    'WEBAPP_PATH',
    path.join(__dirname, '..', 'webapp/build')
  )

  app.use('/', express.static(webappPath, { extensions: ['html'] }))
} else {
  app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Request-Method', '*')
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    next()
  })
}

/**
 * Returns the parcels that land in between the supplied coordinates
 * @param  {string} nw - North west coordinate
 * @param  {string} sw - South west coordinate
 * @return {array}
 */
app.get('/parcels', server.handleRequest(getParcels))

export async function getParcels(req) {
  const mincoords = server.extractFromReq(req, 'mincoords')
  const maxcoords = server.extractFromReq(req, 'maxcoords')

  // TODO: We'll need to add the owners of the parcels from the contract here

  return Parcel.inRange(mincoords, maxcoords)
}

/**
 * Returns the parcels an address owns
 * @param  {string} address - Parcel owner
 * @return {object}
 */
app.get(
  '/api/addresses/:address/parcels',
  server.handleRequest(getAddressParcels)
)

export async function getAddressParcels(req) {
  const address = server.extractFromReq(req, 'address')

  let parcels = [
    {
      x: 0,
      y: 0,
      name: 'Some loren ipsum',
      description: 'This is the description from the first parcel'
    },
    { x: 1, y: 0, name: 'Say my goddamn name', description: '' },
    { x: 0, y: 1, name: '', description: '' }
  ] // from contract

  return new ParcelService().addPrice(parcels)
}

/**
 * Returns all stored districts
 * @return {array}
 */
app.get('/api/districts', server.handleRequest(getDistricts))

export function getDistricts(req) {
  return District.find()
}

/**
 * Start the server
 */
if (require.main === module) {
  db
    .connect()
    .then(() => {
      httpServer.listen(SERVER_PORT, () =>
        console.log('Server running on port', SERVER_PORT)
      )
    })
    .catch(console.error)
}
