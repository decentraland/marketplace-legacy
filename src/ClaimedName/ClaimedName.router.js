import { server } from 'decentraland-server'

import { ClaimedName } from '../ClaimedName'

export class ClaimedNameRouter {
  constructor(app) {
    this.app = app
  }

  mount() {
    /**
     * Returns the user avatar
     * @param  {string} [address] - avatar owner
     * @return {<username, metadata>}
     */
    this.app.get(
      '/addresses/:address/avatars',
      server.handleRequest(this.getAddressAvatar.bind(this))
    )
  }

  async getAddressAvatar(req) {
    const address = server.extractFromReq(req, 'address').toLowerCase()

    const avatar = await ClaimedName.findOne({ owner: address })
    if (!avatar) {
      throw new Error('The address has not associated any avatar yet.')
    }
    return avatar
  }
}
