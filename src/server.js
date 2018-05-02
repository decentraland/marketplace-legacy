import http from 'http'
import express from 'express'
import bodyParser from 'body-parser'

import { eth, contracts } from 'decentraland-eth'
import { server, env, utils } from 'decentraland-commons'

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
import { DashboardService } from './Dashboard'
import { blacklist } from './lib'

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

/**
 * Returns the translations for a given locale
 * @param  {string} locale - locale name
 * @return {array<Translation>}
 */
app.get('/api/translations/:locale', server.handleRequest(getTranslations))

export async function getTranslations(req) {
  let locale = server.extractFromReq(req, 'locale')
  locale = locale.slice(0, 2) // We support base locales for now, like en, it, etc
  return await new Translation().fetch(locale)
}

/**
 * Returns stats for the entire marketplace
 * @return {object}
 */
app.get('/api/dashboard/stats', server.handleRequest(getDashboardStats))

export async function getDashboardStats(req) {
  return await new DashboardService().fetchStats()
}

/**
 * Returns the parcels that land in between the supplied coordinates
 * @param  {string} nw - North west coordinate
 * @param  {string} sw - South west coordinate
 * @param  {string} sort_by - Publication prop
 * @param  {string} sort_order - asc or desc
 * @param  {number} limit
 * @param  {number} offset
 * @return {array<Parcel>}
 */
app.get('/api/parcels', server.handleRequest(getParcels))

export async function getParcels(req) {
  let parcels
  let total

  try {
    const nw = server.extractFromReq(req, 'nw')
    const se = server.extractFromReq(req, 'se')
    const rangeParcels = await Parcel.inRange(nw, se)

    parcels = utils.mapOmit(rangeParcels, blacklist.parcel)
    total = parcels.length
  } catch (error) {
    const filters = new PublicationRequestFilters(req)
    const filterResult = await new PublicationService().filter(filters)
    const publicationBlacklist = [...blacklist.publication, 'parcel']

    // Invert keys, from { publication: { parcel } } to { parcel: { publication } }
    parcels = filterResult.publications.map(publication => ({
      ...utils.omit(publication.parcel, blacklist.parcel),
      publication: utils.omit(publication, publicationBlacklist)
    }))
    total = filterResult.total
  }

  return { parcels, total }
}

/**
 * Returns the publications for a parcel
 * @param  {string} x
 * @param  {string} y
 * @param  {string} [status] - specify a status to retreive: [cancelled|sold|pending].
 * @return {array<Publication>}
 */
app.get(
  '/api/parcels/:x/:y/publications',
  server.handleRequest(getParcelPublications)
)

export async function getParcelPublications(req) {
  const x = server.extractFromReq(req, 'x')
  const y = server.extractFromReq(req, 'y')

  let publications = []

  try {
    const status = server.extractFromReq(req, 'status')
    publications = await Publication.findInCoordinateWithStatus(x, y, status)
  } catch (error) {
    publications = await Publication.findInCoordinate(x, y)
  }

  return utils.mapOmit(publications, blacklist.publication)
}

/**
 * Returns the parcels an address owns
 * @param  {string} address  - Parcel owner
 * @param  {string} [status] - specify a publication status to retreive: [cancelled|sold|pending].
 * @return {array<Parcel>}
 */
app.get(
  '/api/addresses/:address/parcels',
  server.handleRequest(getAddressParcels)
)

export async function getAddressParcels(req) {
  const address = server.extractFromReq(req, 'address').toLowerCase()

  let parcels = []

  try {
    const status = server.extractFromReq(req, 'status')
    parcels = await Parcel.findByOwnerAndStatus(address, status)
  } catch (error) {
    parcels = await Parcel.findByOwner(address)
  }

  return utils.mapOmit(parcels, blacklist.parcel)
}

/**
 * Get the contributions for an address
 * @param  {string} address - District contributor
 * @return {array<Contribution>}
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

  return utils.mapOmit(contributions, blacklist.contribution)
}

/**
 * Returns all stored districts
 * @return {array<District>}
 */
app.get('/api/districts', server.handleRequest(getDistricts))

export async function getDistricts() {
  const districts = await District.findEnabled()
  return utils.mapOmit(districts, blacklist.district)
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
}

function listenOnServerPort() {
  return httpServer.listen(SERVER_PORT, () =>
    console.log('Server running on port', SERVER_PORT)
  )
}
