import { auctionReducer as auction } from './auctionReducer'
import { approvalReducer as approval } from './approvalReducer'
import { parcelReducer as parcel } from './parcelReducer'
import { publicationReducer as publication } from './publicationReducer'
import { mortgageReducer as mortgage } from './mortgageReducer'
import { estateReducer as estates } from './estateReducer'
import { inviteReducer as invites } from './inviteReducer'
import { bidReducer as bids } from './bidReducer'
import { claimedNameReducer as claimedNames } from './claimedNameReducer'

export const reducers = {
  auction,
  approval,
  parcel,
  publication,
  mortgage,
  estates,
  invites,
  bids,
  claimedNames
}
