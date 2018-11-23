import { server } from 'decentraland-commons'
import { Invite } from './Invite.model'

export class InviteRouter {
  constructor(app) {
    this.app = app
  }

  mount() {
    this.app.get(
      '/invites/validate:address',
      server.handleRequest(this.validateAddressInvite)
    )
  }

  async validateAddressInvite(req) {
    const address = server.extractFromReq(req, 'address').toUpperCase()
    const invite = Invite.hasInvite(address)
    return {
      address: address,
      invited: invite
    }
  }
}
