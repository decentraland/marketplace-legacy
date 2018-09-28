import { getContractAddress } from 'modules/wallet/utils'

export function isLegacyPublication(publication) {
  return (
    publication.marketplace_address === getContractAddress('LegacyMarketplace')
  )
}
