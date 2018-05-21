import { env } from 'decentraland-commons'
import { Publication } from '../Publication'

export class MarketplaceEvent {
  constructor(event) {
    this.event = event
  }

  getId() {
    // TODO: makeshift method, check pending
    return env.get('MARKETPLACE_CONTRACT_ADDRESS')
  }

  getType() {
    // TODO: makeshift method, check pending
    return Publication.TYPES.parcel
  }
}
