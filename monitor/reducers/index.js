import { auctionReducer as auction } from './auctionReducer'
import { parcelReducer as parcel } from './parcelReducer'
import { publicationReducer as publication } from './publicationReducer'
import { mortgageReducer as mortgage } from './mortgageReducer'
import { estateReducer as estates } from './estateReducer'
import { inviteReducer as invites } from './inviteReducer'

export const reducers = {
  auction,
  parcel,
  publication,
  mortgage,
  estates,
  inviteReducer
}
