import { server } from 'decentraland-commons'
import { Invite } from './Invite.model'

export class InviteRouter {
  constructor(app) {
    this.app = app
  }

  mount() {
    this.app.get(
      '/invites/:address/validate',
      server.handleRequest(this.validateAddressInvite)
    )
  }

  async validateAddressInvite(req) {
    const address = server.extractFromReq(req, 'address')
    const invite = await Invite.hasInvite(address)
    return {
      address: address,
      invited: invite
    }
  }
}
