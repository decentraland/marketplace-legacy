import { Log } from 'decentraland-commons'

import { ClaimedName } from '../../src/ClaimedName'
import { contractAddresses, eventNames } from '../../src/ethereum'

const log = new Log('claimedNameReducer')

export async function claimedNameReducer(event) {
  const { address } = event

  switch (address) {
    case contractAddresses.AvatarNameRegistry: {
      await reduceClaimName(event)
      break
    }
    default:
      break
  }
}

async function reduceClaimName(event) {
  const { name } = event

  switch (name) {
    case eventNames.Register: {
      const { _owner, _username, _metadata } = event.args

      const user = await ClaimedName.findOne({ owner: _owner })

      if (!user) {
        log.info(`[${name}] ${_owner} claim the username: ${_username}`)
        await ClaimedName.insert({
          owner: _owner,
          username: _username,
          metadata: _metadata
        })
      } else {
        log.info(`[${name}] ${_owner} update his username to: ${_username}`)
        await ClaimedName.update(
          { username: _username, metadata: _metadata },
          { owner: _owner }
        )
      }

      break
    }
    case eventNames.MedatadaChange: {
      const { _owner, _metadata } = event.args

      const user = ClaimedName.findOne({ owner: _owner })

      if (user) {
        log.info(`[${name}] ${_owner} update his metadata to: set ${_metadata}`)
        await ClaimedName.update({ owner: _owner }, { metadata: _metadata })
      }
      break
    }
    default:
      break
  }
}
