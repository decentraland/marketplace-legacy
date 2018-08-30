import { env } from 'decentraland-commons'

import { ASSET_TYPE } from '../shared/asset'

export class MarketplaceEvent {
  constructor(event) {
    this.event = event
  }

  getAddress() {
    // TODO: makeshift method, check pending
    return env.get('MARKETPLACE_CONTRACT_ADDRESS')
  }

  getType() {
    // TODO: makeshift method, check pending
    return ASSET_TYPE.parcel
  }
}
