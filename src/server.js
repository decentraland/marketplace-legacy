import http from 'http'
import express from 'express'
import bodyParser from 'body-parser'

import { server, env, eth, contracts, utils } from 'decentraland-commons'

import { db } from './database'
import { Parcel } from './Parcel'
import { Contribution } from './Contribution'
import { District } from './District'
import {
  Publication,
  PublicationService,
  PublicationRequestFilters
} from './Publication'
import { Translation } from './Translation'

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
}

/**
 * Returns the translations for a given locale
 * @param  {string} locale - locale name
 * @return {array}
 */
app.get('/api/translations/:locale', server.handleRequest(getTranslations))

export async function getTranslations(req) {
  let locale = server.extractFromReq(req, 'locale')
  locale = locale.slice(0, 2) // We support base locales for now, like en, it, etc
  return await new Translation().fetch(locale)
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
  const parcels = await Parcel.inRange(nw, se)

  return utils.mapOmit(parcels, ['asset_id', 'created_at', 'updated_at'])
}

/**
 * Returns the publications for a parcel
 * @param  {string} x
 * @param  {string} y
 * @return {array}
 */
app.get(
  '/api/parcels/:x/:y/publications',
  server.handleRequest(getParcelPublications)
)

export async function getParcelPublications(req) {
  const x = server.extractFromReq(req, 'x')
  const y = server.extractFromReq(req, 'y')
  const publications = await Publication.findInCoordinate(x, y)

  return publications
}

/**
 * Returns the parcels an address owns
 * @param  {string} address - Parcel owner
 * @return {array}
 */
app.get(
  '/api/addresses/:address/parcels',
  server.handleRequest(getAddressParcels)
)

export async function getAddressParcels(req) {
  const address = server.extractFromReq(req, 'address')
  const parcels = await Parcel.findByOwner(address.toLowerCase())

  return utils.mapOmit(parcels, ['asset_id', 'created_at', 'updated_at'])
}

/**
 * Get the contributions for an address
 * @param  {string} address - District contributor
 * @return {array}
 */
app.get(
  '/api/addresses/:address/contributions',
  server.handleRequest(getAddressContributions)
)

export async function getAddressContributions(req) {
  const address = server.extractFromReq(req, 'address')
  const contributions = await Contribution.findGroupedByAddress(
    address.toLowerCase()
  )

  return utils.mapOmit(contributions, [
    'message',
    'signature',
    'created_at',
    'updated_at'
  ])
}

/**
 * Returns the publications an address owns
 * @param  {string} address - Publication owner
 * @return {array}
 */
app.get(
  '/api/addresses/:address/publications',
  server.handleRequest(getAddressPublications)
)

export async function getAddressPublications(req) {
  const address = server.extractFromReq(req, 'address')
  return Publication.findByOwner(address.toLowerCase())
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

/**
 * Returns all publications. Supports pagination and filtering
 * @param  {string} sort_by - Publication prop
 * @param  {string} sort_order - asc or desc
 * @param  {number} limit
 * @param  {number} offset
 * @return {array}
 */
app.get('/api/publications', server.handleRequest(getPublications))

export async function getPublications(req) {
  const filters = new PublicationRequestFilters(req)
  const { publications, total } = await new PublicationService().filter(filters)

  return {
    publications: utils.mapOmit(publications, ['updated_at']),
    total
  }
}

/**
 * Get a publication by transaction hash
 * @param  {string} txHash
 * @return {array}
 */
app.get('/api/publications/:txHash', server.handleRequest(getPublication))

export async function getPublication(req) {
  const txHash = server.extractFromReq(req, 'txHash')
  const publication = await Publication.findOne({ tx_hash: txHash })

  if (!publication) {
    throw new Error(
      `Could not find a valid publication for the hash "${txHash}"`
    )
  }

  return publication
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
    .connect({
      contracts: [contracts.LANDRegistry],
      providerUrl: env.get('RPC_URL') // default to localhost
    })
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
