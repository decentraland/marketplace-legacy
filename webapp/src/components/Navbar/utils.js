import { locations, NAVBAR_PAGES } from 'locations'

export function getActivePage({ pathname, wallet }) {
  let currentPage = null
  if (pathname === locations.marketplace) {
    currentPage = NAVBAR_PAGES.marketplace
  } else if (pathname === locations.dashboard) {
    currentPage = NAVBAR_PAGES.dashboard
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
  } else if (pathname === locations.signIn) {
    currentPage = NAVBAR_PAGES.signIn
  }

  return currentPage
}
