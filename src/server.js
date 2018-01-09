import http from 'http'
import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'

import { server, env, eth, utils } from 'decentraland-commons'
import { LANDToken } from 'decentraland-commons'

import db from './database'
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
app.get('/api/parcels', server.handleRequest(getParcels))

export async function getParcels(req) {
  const nw = server.extractFromReq(req, 'nw')
  const se = server.extractFromReq(req, 'se')

  let parcels = await Parcel.inRange(nw, se)
  parcels = await new ParcelService().addOwners(parcels)

  return utils.mapOmit(parcels, ['created_at', 'updated_at'])
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

  const contractParcels = [
    {
      x: 0,
      y: 0,
      name: 'Some loren ipsum',
      description: 'This is the description from the first parcel'
    },
    { x: 1, y: 0, name: 'Say my goddamn name', description: '' },
    { x: 0, y: 1, name: '', description: '' }
  ] // from contract

  const parcels = new ParcelService().addPrices(contractParcels)

  return utils.mapOmit(parcels, ['created_at', 'updated_at'])
}

/**
 * Returns all stored districts
 * @return {array}
 */
app.get('/api/districts', server.handleRequest(getDistricts))

export async function getDistricts(req) {
  const districts = await District.find()
  return utils.mapOmit(districts, ['parcel_ids', 'created_at', 'updated_at'])
}

/* Start the server only if run directly */
if (require.main === module) {
  Promise.resolve()
    .then(connectDatabase)
    .then(connectEthereum)
    .then(listenOnServerPort)
    .catch(console.error)
}

function connectDatabase() {
  return db.connect()
}

function connectEthereum() {
  return eth
    .connect([LANDToken])
    .catch(() =>
      console.error(
        'Could not connect to the Ethereum node. Some endpoints may not work correctly. Make sure you have a node running on port 8545'
      )
    )
}

function listenOnServerPort() {
  return httpServer.listen(SERVER_PORT, () =>
    console.log('Server running on port', SERVER_PORT)
  )
}
