import http from 'http'
import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'

import { server, env, eth, utils, SignedMessage } from 'decentraland-commons'
import { LANDRegistry } from 'decentraland-contracts'

import db from './database'
import { District } from './District'
import { Parcel, ParcelService } from './Parcel'
import { Contribution } from './Contribution'

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
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, DELETE'
    )
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
 * Edit the metadata of an owned parcel
 * @param  {string} address - Owner of the parcel address
 * @param  {object} parcel - New parcel data
 * @return {object}
 */
app.post('/api/parcels/edit', server.handleRequest(editParcels))

export async function editParcels(req) {
  const message = server.extractFromReq(req, 'message')
  const signature = server.extractFromReq(req, 'signature')

  const signedMessage = new SignedMessage(message, signature)
  const parcelService = new ParcelService()

  const changes = parcelService.getValuesFromSignedMessage(signedMessage)
  const address = signedMessage.getAddress()
  const parcel = { x: changes.x, y: changes.y }

  if (await parcelService.isOwner(address, parcel)) {
    await Parcel.update(changes, parcel)
  } else {
    throw new Error('You can only edit your own parcels')
  }

  return true
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

  const parcelService = new ParcelService()

  const contractParcels = await parcelService.getLandOf(address)
  const parcels = await parcelService.addDbData(contractParcels)

  return utils.mapOmit(parcels, ['created_at', 'updated_at'])
}

/**
 * Get the contributions for an address
 * @param  {string} address - District contributor
 * @return {object}
 */
app.get(
  '/api/addresses/:address/contributions',
  server.handleRequest(getAddressContributions)
)

export async function getAddressContributions(req) {
  const address = server.extractFromReq(req, 'address')
  const districts = await Contribution.findByAddress(address)

  return utils.mapOmit(districts, [
    'message',
    'signature',
    'created_at',
    'updated_at'
  ])
}

/**
 * Returns all stored districts
 * @return {array}
 */
app.get('/api/districts', server.handleRequest(getDistricts))

export async function getDistricts() {
  const districts = await District.findEnabled()
  return utils.mapOmit(districts, [
    'disabled',
    'address',
    'parcel_ids',
    'created_at',
    'updated_at'
  ])
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
    .connect(null, [LANDRegistry])
    .catch(error =>
      console.error(
        '\nCould not connect to the Ethereum node. Some endpoints may not work correctly.',
        '\nMake sure you have a node running on port 8545.',
        `\nError: "${error.message}"\n`
      )
    )
}

function listenOnServerPort() {
  return httpServer.listen(SERVER_PORT, () =>
    console.log('Server running on port', SERVER_PORT)
  )
}
