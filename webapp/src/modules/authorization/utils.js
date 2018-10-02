import { isLegacyPublication } from 'modules/publication/utils'

export function getCurrentAllowance(publication, authorization) {
  const { allowances } = authorization

  return isLegacyPublication(publication)
    ? allowances.LegacyMarketplace.MANAToken
    : allowances.Marketplace.MANAToken
}
