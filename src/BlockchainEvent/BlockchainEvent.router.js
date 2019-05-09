import { server } from 'decentraland-server'

import { BlockchainEvent } from './BlockchainEvent.model'

import { BlockchainEventsReqQueryParams } from '../ReqQueryParams'

export class BlockchainEventRouter {
  constructor(app) {
    this.app = app
  }

  mount() {
    /**
     * Returns the assets for the supplied params
     * @param  {string} address - contract address
     * @param  {string} name - event name
     * @param  {array} args - arg key -> value
     * @param  {number} from_block
     * @param  {number} to_block
     * @return {array<Asset>}
     */
    this.app.get(
      '/blockchainEvents',
      server.handleRequest(this.getBlockchainEvents)
    )
  }

  async getBlockchainEvents(req) {
    const blockchainEventsReqQueryParams = new BlockchainEventsReqQueryParams(
      req
    )

    const events = await BlockchainEvent.filterAll(
      blockchainEventsReqQueryParams
    )

    return {
      events
    }
  }
}
