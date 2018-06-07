import { env } from 'decentraland-commons'
import { PUBLICATION_TYPES } from '../shared/publication'

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
    return PUBLICATION_TYPES.parcel
  }
}
