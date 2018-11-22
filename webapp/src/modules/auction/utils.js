import { env } from 'decentraland-commons'
import { getLocalStorage } from '@dapps/lib/localStorage'

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
