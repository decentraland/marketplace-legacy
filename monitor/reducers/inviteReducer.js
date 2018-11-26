import { Log } from 'decentraland-commons'
import { eth, Contract } from 'decentraland-eth'
import { contractAddresses, eventNames } from '../../src/ethereum'
import { Invite } from '../../src/Invite'

const log = new Log('inviteReducer')

export async function inviteReducer(event) {
  const { address } = event
  switch (address) {
    case contractAddresses.DecentralandInvite: {
      await reduceInvite(event)
      break
    }
    default:
      break
  }
}

async function reduceInvite(event) {
  const { name } = event
  if (name === eventNames.Transfer) {
    const { _to, _from } = event.args
    const inviteContract = eth.getContract('DecentralandInvite')
    await updateAddressInviteStatus(inviteContract, _to)
    await updateAddressInviteStatus(inviteContract, _from)
  }
}

async function updateAddressInviteStatus(inviteContract, address) {
  if (!Contract.isEmptyAddress(address)) {
    log.info(`Updating Invite information for address [${address}]`)
    const balance = await inviteContract.balanceOf(address)
    const hasInvite = balance.toNumber() > 0
    return Invite.createOrUpdate(address, hasInvite)
  }
}
