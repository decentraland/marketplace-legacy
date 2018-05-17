import { env } from 'decentraland-commons'
import { Publication } from '../Publication'

export class MarketplaceEvent {
  event: string

  constructor(event: string) {
    this.event = event
  }

  getId(): string {
    // TODO: makeshift method, check pending
    return env.get('MARKETPLACE_CONTRACT_ADDRESS')
  }

  getType(): string {
    // TODO: makeshift method, check pending
    return Publication.TYPES.parcel
  }
}
