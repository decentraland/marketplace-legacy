import { server } from 'decentraland-server'
import { env } from 'decentraland-commons'

import { Approval } from '../Approval'
import { Parcel, Estate } from '../Asset'
import { ASSET_TYPES } from '../shared/asset'
import { APPROVAL_TYPES } from '../shared/approval'
import { ReqQueryParams } from '../ReqQueryParams'

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
        tokenAddress = env.get('LAND_REGISTRY_CONTRACT_ADDRESS')
        break
      }
      case ASSET_TYPES.estate: {
        tokenAddress = env.get('ESTATE_REGISTRY_CONTRACT_ADDRESS')
        break
      }
      default:
        throw new Error(`The assetType ${assetType} is invalid`)
    }

    const approval = {
      token_address: tokenAddress.toLowerCase(),
      owner: asset.owner,
      operator: address
    }
    const [isApprovedForAll, isUpdateManager] = await Promise.all([
      Approval.count({ type: APPROVAL_TYPES.operator, ...approval }),
      Approval.count({ type: APPROVAL_TYPES.manager, ...approval })
    ])

    return {
      isApprovedForAll: isApprovedForAll > 0,
      isUpdateManager: isUpdateManager > 0,
      isOwner: asset.owner === address,
      isOperator: asset.operator === address,
      isUpdateOperator: asset.update_operator === address
    }
  }

  async getParcelAuthorizations(req) {
    const reqQueryParams = new ReqQueryParams(req)

    const x = reqQueryParams.getInteger('x')
    const y = reqQueryParams.getInteger('y')
    const address = reqQueryParams.get('address').toLowerCase()

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
    const address = server.extractFromReq(req, 'address').toLowerCase()

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
