import { contractAddresses, eventNames } from '../../src/ethereum'

export async function publicationReducer(event) {
  const { address, name } = event

  switch (address) {
    case contractAddresses.Bid: {
      switch (name) {
        case eventNames.BidCreated:
        case eventNames.BidAccepted:
        case eventNames.BidCancelled: {
          break
        }
      }
      break
    }
    default:
      break
  }
}
