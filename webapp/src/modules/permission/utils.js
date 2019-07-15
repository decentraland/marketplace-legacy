import { isOnSale } from 'modules/asset/utils'
import { hasLegacyPublication } from 'modules/publication/utils'
import { can as baseCan, ACTIONS } from 'shared/permissions'
import { hasParcelsConnected } from 'shared/parcel'
import { isParcelListable } from 'shared/listing'
import { hasBid } from 'shared/bid'

export * from 'shared/permissions'

export function can(action, wallet, asset, publications) {
  if (!wallet) {
    return false
  }

  const baseResult = baseCan(action, wallet.address, asset)
  const isListed = isOnSale(asset, publications)

  let extraChecks = true

  switch (action) {
    // TODO: Maybe get asset.mortgage here and check
    case ACTIONS.bid:
      // extraChecks = !hasBid(bids, wallet.address) && isParcelListable(asset)
      break
    case ACTIONS.buy:
      extraChecks = !isListed
      break
    case ACTIONS.cancelSale:
      extraChecks = isListed
      break
    case ACTIONS.createEstate:
      extraChecks = !isListed && hasParcelsConnected(asset, wallet.parcelsById)
      break
    case ACTIONS.getMortgage:
      extraChecks = !isListed && hasLegacyPublication(asset)
      break
    default:
      break
  }

  return baseResult && extraChecks
}
