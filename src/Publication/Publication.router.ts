import { server, utils } from 'decentraland-commons'
import * as express from 'express'

import { Publication, PublicationAttributes } from './Publication.model'
import { Parcel } from '../Parcel'
import { Router, blacklist } from '../lib'

export class PublicationRouter extends Router {
  mount() {
    /**
     * Returns the publications for a parcel
     * @param  {string} x
     * @param  {string} y
     * @param  {string} [status] - specify a status to retreive: [cancelled|sold|pending].
     * @return {array<Publication>}
     */
    this.app.get(
      '/api/parcels/:x/:y/publications',
      server.handleRequest(this.getParcelPublications)
    )

    /**
     * Get a publication by transaction hash
     * @param  {string} txHash
     * @return {array}
     */
    this.app.get(
      '/api/publications/:txHash',
      server.handleRequest(this.getPublication)
    )
  }

  async getParcelPublications(
    req: express.Request
  ): Promise<PublicationAttributes[]> {
    const x = server.extractFromReq(req, 'x')
    const y = server.extractFromReq(req, 'y')
    const id = Parcel.buildId(x, y)

    let publications = []

    try {
      const status = server.extractFromReq(req, 'status')
      publications = await Publication.findByAssetIdWithStatus(id, status)
    } catch (error) {
      publications = await Publication.findByAssetId(id)
    }

    return utils.mapOmit(publications, blacklist.publication)
  }

  async getPublication(req: express.Request): Promise<PublicationAttributes> {
    const txHash = server.extractFromReq(req, 'txHash')
    const publication = await Publication.findOne({
      tx_hash: txHash
    })

    if (!publication) {
      throw new Error(
        `Could not find a valid publication for the hash "${txHash}"`
      )
    }

    return publication
  }
}
