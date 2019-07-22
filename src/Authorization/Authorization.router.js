import { server } from 'decentraland-server'

import { Approval } from '../Approval'
import { Parcel, Estate } from '../Asset'
import { ASSET_TYPES, getContractAddressByAssetType } from '../shared/asset'
import { APPROVAL_TYPES } from '../shared/approval'
import { ReqQueryParams } from '../ReqQueryParams'

export class AuthorizationRouter {
  constructor(app) {
    this.app = app
  }

  mount() {
    /**
     * Returns the authorizations for a parcel
     * @param  {string} x
     * @param  {string} y
     * @param  {string} [address] - address to get authorizations
     * @return {<id, address, isApprovedForAll, isUpdateManager, isOwner, isOperator, isUpdateOperator, isUpdateAuthorized>}
     */
    this.app.get(
      '/parcels/:x/:y/:address/authorizations',
      server.handleRequest(this.getParcelAuthorizations.bind(this))
    )

    /**
     * Returns the authorizations for an estate
     * @param  {string} id
     * @param  {string} [address] - address to get authorizations
     * @return {<id, address, isApprovedForAll, isUpdateManager, isOwner, isOperator, isUpdateOperator, isUpdateAuthorized>}
     */
    this.app.get(
      '/estates/:id/:address/authorizations',
      server.handleRequest(this.getEstateAuthorizations.bind(this))
    )
  }

  async getAuthorizations(asset, assetType, address) {
    const tokenAddress = getContractAddressByAssetType(assetType)

    const approval = {
      token_address: tokenAddress.toLowerCase(),
      owner: asset.owner,
      operator: address
    }
    let [isApprovedForAll, isUpdateManager] = await Promise.all([
      Approval.count({ type: APPROVAL_TYPES.operator, ...approval }),
      Approval.count({ type: APPROVAL_TYPES.manager, ...approval })
    ])

    isApprovedForAll = isApprovedForAll > 0
    isUpdateManager = isUpdateManager > 0

    const isOwner = asset.owner === address
    const isOperator = asset.operator === address
    const isUpdateOperator = asset.update_operator === address
    const isUpdateAuthorized =
      isApprovedForAll ||
      isUpdateManager ||
      isOwner ||
      isOperator ||
      isUpdateOperator

    return {
      isApprovedForAll,
      isUpdateManager,
      isOwner,
      isOperator,
      isUpdateOperator,
      isUpdateAuthorized
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

    if (parcel.estate_id) {
      const estate = await Estate.findOne({ id: parcel.estate_id })

      const { isUpdateAuthorized } = await this.getAuthorizations(
        estate,
        ASSET_TYPES.estate,
        address
      )

      if (isUpdateAuthorized) {
        authorizations.isUpdateAuthorized = true
      }
    }

    return {
      id: parcel.id,
      address,
      ...authorizations
    }
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
