import { locations, NAVBAR_PAGES } from 'locations'
import {
  isProfilePage,
  isAtlasPage,
  isMarketplace
} from 'modules/location/utils'

export function getActivePage({ pathname, address }) {
  let currentPage = null
  if (isMarketplace(pathname)) {
    currentPage = NAVBAR_PAGES.marketplace
  } else if (isProfilePage(pathname, address)) {
    currentPage = NAVBAR_PAGES.profile
  } else if (isAtlasPage(pathname)) {
    currentPage = NAVBAR_PAGES.atlas
  } else if (pathname === locations.activity()) {
    currentPage = NAVBAR_PAGES.activity
  } else if (pathname === locations.settings()) {
    currentPage = NAVBAR_PAGES.settings
  } else if (pathname === locations.signIn()) {
    currentPage = NAVBAR_PAGES.signIn
  }

  return currentPage
}
