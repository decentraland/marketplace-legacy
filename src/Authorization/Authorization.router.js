import { server } from 'decentraland-commons'

import { Approval } from '../Approval'
import { Parcel, Estate } from '../Asset'
import { ASSET_TYPES } from '../shared/asset'
import { ReqQueryParams } from '../ReqQueryParams'
import { contractAddresses } from '../ethereum'

export class AuthorizationRouter {
  constructor(app) {
    this.app = app
  }

  mount() {
    /**
     * Returns the bids for a parcel
     * @param  {string} x
     * @param  {string} y
     * @param  {string} [address] - address to get authorizations
     * @return {<id, address, isOwner, isApprovedForAll, isOwner, isOperator, isUpdateOperator>}
     */
    this.app.get(
      '/parcels/:x/:y/:address/authorizations',
      server.handleRequest(this.getParcelAuthorizations.bind(this))
    )

    /**
     * Returns the bids for a parcel
     * @param  {string} id
     * @param  {string} [address] - address to get authorizations
     * @return {<id, address, isOwner, isApprovedForAll, isOwner, isOperator, isUpdateOperator>}
     */
    this.app.get(
      '/estates/:id/:address/authorizations',
      server.handleRequest(this.getEstateAuthorizations.bind(this))
    )
  }

  async getAuthorizations(asset, assetType, address) {
    let tokenAddress

    switch (assetType) {
      case ASSET_TYPES.parcel: {
        tokenAddress = contractAddresses.LANDRegistry
        break
      }
      case ASSET_TYPES.estate: {
        tokenAddress = contractAddresses.EstateRegistry
        break
      }
      default:
        throw new Error(`The assetType ${assetType} is invalid`)
    }

    const isApprovedForAll = await Approval.isApprovedForAll(
      tokenAddress.toLowerCase(),
      asset.owner,
      address.toLowerCase()
    )

    return {
      isApprovedForAll,
      isOwner: asset.owner === address,
      isOperator: asset.operator === address,
      isUpdateOperator: asset.update_operator === address
    }
  }

  async getParcelAuthorizations(req) {
    const reqQueryParams = new ReqQueryParams(req)

    const x = reqQueryParams.getInteger('x')
    const y = reqQueryParams.getInteger('y')
    const address = reqQueryParams.get('address')

    const parcel = await Parcel.findOne({ x, y })

    if (!parcel) {
      throw new Error('Parcel does not exist')
    }

    const authorizations = await this.getAuthorizations(
      parcel,
      ASSET_TYPES.parcel,
      address
    )

    return { id: parcel.id, address, ...authorizations }
  }

  async getEstateAuthorizations(req) {
    const id = server.extractFromReq(req, 'id')
    const address = server.extractFromReq(req, 'address')

    const estate = await Estate.findOne({ id })

    if (!estate) {
      throw new Error('Estate does not exist')
    }

    const authorizations = await this.getAuthorizations(
      estate,
      ASSET_TYPES.estate,
      address
    )

    return { id, address, ...authorizations }
  }
}
