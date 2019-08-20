import { isOnSale } from 'modules/asset/utils'
import { hasParcelsConnected } from 'shared/parcel'

export function canCreateEstate(wallet, parcel, publications) {
  console.log(wallet)
  return (
    !isOnSale(parcel, publications) &&
    hasParcelsConnected(parcel, wallet.parcelsById)
  )
}
