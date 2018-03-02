import { locations, NAVBAR_PAGES } from 'locations'

export function getActivePage({ pathname, wallet }) {
  let currentPage = null
  if (pathname === locations.marketplace) {
    currentPage = NAVBAR_PAGES.marketplace
  } else if (
    wallet.address &&
    pathname.slice(0, 9) === '/address/' &&
    pathname.slice(9, 51).toLowerCase() === wallet.address
  ) {
    currentPage = NAVBAR_PAGES.profile
  } else if (/^\/-?\d+\/-?\d+$/gi.test(pathname)) {
    currentPage = NAVBAR_PAGES.atlas
  } else if (pathname === locations.activity) {
    currentPage = NAVBAR_PAGES.activity
  } else if (pathname === locations.settings) {
    currentPage = NAVBAR_PAGES.settings
  }

  return currentPage
}
