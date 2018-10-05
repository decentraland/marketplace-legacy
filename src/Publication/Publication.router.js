import { server } from 'decentraland-commons'

import { Publication } from './Publication.model'
import { Parcel } from '../Asset'
import { ASSET_TYPES } from '../../shared/asset'
import { sanitizePublications } from '../sanitize'

export class PublicationRouter {
  constructor(app) {
    this.app = app
  }

  mount() {
    /**
     * Returns the publications for an asset
     * @param  {string} x
     * @param  {string} y
     * @param  {string} asset_type - specify an asset type, it's required
     * @param  {string} [status] - specify a status to retreive: [cancelled|sold|pending].
     * @return {array<Publication>}
     */
    this.app.get(
      '/assets/:id/publications',
      server.handleRequest(this.getAssetPublications)
    )

    /**
     * Returns the publications for a parcel
     * @param  {string} x
     * @param  {string} y
     * @param  {string} [status] - specify a status to retreive: [cancelled|sold|pending].
     * @return {array<Publication>}
     */
    this.app.get(
      '/parcels/:x/:y/publications',
      server.handleRequest(this.getParcelPublications.bind(this))
    )

    /**
     * Returns the publications for a estate
     * @param  {string} id
     * @param  {string} [status] - specify a status to retreive: [cancelled|sold|pending].
     * @return {array<Publication>}
     */
    this.app.get(
      '/estates/:id/publications',
      server.handleRequest(this.getEstatePublications.bind(this))
    )

    /**
     * Get a publication by transaction hash
     * @param  {string} txHash
     * @return {array}
     */
    this.app.get(
      '/publications/:txHash',
      server.handleRequest(this.getPublication)
    )
  }

  async getAssetPublications(req) {
    const id = server.extractFromReq(req, 'id')

    server.extractFromReq(req, 'asset_type') // TODO: Use asset_type on `Publication.findByAsset(...)`. For now just throw if undefined

    let publications = []

    try {
      const status = server.extractFromReq(req, 'status')
      publications = await Publication.findByAssetIdWithStatus(id, status)
    } catch (error) {
      publications = await Publication.findByAssetId(id)
    }

    return sanitizePublications(publications)
  }

  async getParcelPublications(req) {
    const x = server.extractFromReq(req, 'x')
    const y = server.extractFromReq(req, 'y')

    req.params.asset_type = ASSET_TYPES.parcel
    req.params.id = Parcel.buildId(x, y)

    return this.getAssetPublications(req)
  }

  async getEstatePublications(req) {
    req.params.asset_type = ASSET_TYPES.estate

    return this.getAssetPublications(req)
  }

  async getPublication(req) {
    const txHash = server.extractFromReq(req, 'txHash')
    const publication = await Publication.findOne({ tx_hash: txHash })

    if (!publication) {
      throw new Error(
        `Could not find a valid publication for the hash "${txHash}"`
      )
    }

    return publication
  }
}
