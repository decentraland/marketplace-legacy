import { getLocalStorage } from '@dapps/lib/localStorage'

export function hasSeenAuctionModal() {
  const localStorage = getLocalStorage()
  return localStorage.getItem('seenAuctionModal')
}

export function isAuthorized(authorization) {
  return authorization && authorization.allowances.LANDAuction.MANAToken > 0
}

export function dismissAuctionModal() {
  const localStorage = getLocalStorage()
  localStorage.setItem('seenAuctionModal', Date.now())
}
