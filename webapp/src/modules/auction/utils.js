import { env } from 'decentraland-commons'

import { localStorage } from 'lib/localStorage'

export const TOKEN_ADDRESSES = {
  MANA: env.get('REACT_APP_MANA_TOKEN_CONTRACT_ADDRESS'),
  BNB: env.get('REACT_APP_BNB_TOKEN_CONTRACT_ADDRESS'),
  DAI: env.get('REACT_APP_DAI_TOKEN_CONTRACT_ADDRESS'),
  ELF: env.get('REACT_APP_ELF_TOKEN_CONTRACT_ADDRESS'),
  KNC: env.get('REACT_APP_KNC_TOKEN_CONTRACT_ADDRESS'),
  MKR: env.get('REACT_APP_MKR_TOKEN_CONTRACT_ADDRESS'),
  SNT: env.get('REACT_APP_SNT_TOKEN_CONTRACT_ADDRESS'),
  ZIL: env.get('REACT_APP_ZIL_TOKEN_CONTRACT_ADDRESS')
}

export const TOKEN_SYMBOLS = Object.keys(TOKEN_ADDRESSES)

export const AUCTION_HELPERS = Object.freeze({
  SEEN_AUCTION_MODAL: 'seenAuctionModal',
  SEEN_AUCTION_TOKEN_TOOLTIP: 'seenAuctionTokenTooltip'
})

export function isAuthorized(authorization) {
  return authorization && authorization.allowances.LANDAuction.MANAToken > 0
}

export function hasSeenAuctionHelper(key) {
  return localStorage.getItem(key)
}

export function dismissAuctionHelper(key) {
  localStorage.setItem(key, Date.now())
}

export function getVideoTutorialLink() {
  return 'https://www.youtube-nocookie.com/embed/-HmXrOTEmxg?controls=0'
}
