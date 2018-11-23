import { Log } from 'decentraland-commons'
import { contractAddresses, eventNames } from '../../src/ethereum'
import { contracts } from 'decentraland-eth' 
import { Invite } from '../../src/Invite';

const log = new Log('inviteReducer')
const inviteContract =new contracts.DecentralandInvite()

const zero_address = '0x0000000000000000000000000000000000000000'

export async function inviteReducer(event) {
  const { address } = event
  if (address === contractAddresses.DecentralandInvite) {
    await reduceInvite(event)
  }
}

async function reduceInvite(event) {
  const { name } = event
  if (name === eventNames.Transfer) {
    const { _to, _from } = event.args
    updateAddressInviteStatus(_to)
    updateAddressInviteStatus(_from)
  }
}

function updateAddressInviteStatus(address) {
  if (address !== zero_address) {
    log.info(`Updating Invite information for address [${address}]`)
    const balance = await inviteContract.balanceOf(address)
    const hasInvite = balance.toNumber() > 0
    Invite.createOrUpdate(address, hasInvite)
  }
}
