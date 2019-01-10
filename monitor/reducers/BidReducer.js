import { contractAddresses, eventNames } from '../../src/ethereum'
import { isDuplicatedConstraintError } from '../../src/database'
import { Bid } from '../../src/Bid'

export async function publicationReducer(event) {
  const { address } = event

  switch (address) {
    case contractAddresses.Bid: {
      await reduceBid(event)
      break
    }
    default:
      break
  }
}

async function reduceBid(event) {
  const { name } = event

  switch (name) {
    case eventNames.BidCreated: {
      const {
        _id,
        _tokenAddress,
        _tokenId,
        _bidder,
        _price,
        _expiresAt
      } = event.args

      const bid = await Bid.getAsset({ id: _id })
      if (bid) {
        throw 'Bid already exist'
      }
      try {
        await Bid.Insert({
          id: _id,
          token_address: _tokenAddress,
          token_id: _tokenId,
          bidder: _bidder,
          price: _price,
          expiresAt: _expiresAt
        })
      } catch (error) {
        if (!isDuplicatedConstraintError(error)) throw error
        log.info(
          `[${name}] Publication of hash ${tx_hash} and id ${contract_id} already exists and it's not open`
        )
      }

      break
    }
    case eventNames.BidAccepted:
      break
    case eventNames.BidCancelled: {
      break
    }
    default:
      break
  }
}
