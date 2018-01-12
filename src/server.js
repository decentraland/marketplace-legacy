import http from 'http'
import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'

import { server, env, eth, utils, SignedMessage } from 'decentraland-commons'
import { LANDToken } from 'decentraland-contracts'

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

  // TODO: Change this. It should be fetched from the LAND contract's `assetsOf`
  // TODO: Filter if it's 0
  let contractParcels = await Parcel.inRange([12, 14], [14, 16])

  // TODO: Move to ParcelService
  const parcelIds = contractParcels.map(parcel =>
    Parcel.buildId(parcel.x, parcel.y)
  )
  const dbParcels = await Parcel.findInIds(parcelIds)
  const dbParcelsObj = dbParcels.reduce((map, parcel) => {
    map[parcel.id] = parcel
    return map
  }, {})

  const parcels = contractParcels.map((parcel, index) => {
    const dbParcel = dbParcelsObj[parcel.id]
    if (!dbParcel) return parcel

    const { name, description, price } = dbParcel
    return Object.assign({ name, description, price }, parcel)
  })

  return utils.mapOmit(parcels, ['created_at', 'updated_at'])
}

/**
 * Returns all stored districts
 * @return {array}
 */
app.get('/api/districts', server.handleRequest(getDistricts))

export async function getDistricts(req) {
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
    .connect(null, [LANDToken])
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
