import { env } from 'decentraland-commons'
import { eth } from 'decentraland-eth'

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
  SEEN_AUCTION_TOKEN_TOOLTIP: 'seenAuctionTokenTooltip',
  SUBSCRIBED_TO_AUCTION_BY_EMAIL: 'subscribedToAuction'
})

export const AUCTION_DURATION_IN_DAYS = 14

export function isAuthorized(authorization) {
  return authorization && authorization.allowances.LANDAuction.MANAToken > 0
}

export function hasSeenAuctionHelper(key) {
  return localStorage.getItem(key)
}

export function dismissAuctionHelper(key) {
  localStorage.setItem(key, Date.now())
}

export function getYoutubeTutorialId() {
  return 'uYESj1OYu24'
}

export async function hasAuctionFinished() {
  const landAuction = eth.getContract('LANDAuction')
  const endTime = await landAuction.endTime()
  return endTime.toNumber() > 0 && Date.now() / 1000 >= endTime.toNumber()
}

export function hasAuctionStarted() {
  return getAuctionStartDate() <= Date.now()
}

export async function isAuctionActive() {
  const hasFinished = await hasAuctionFinished()
  const hasStarted = hasAuctionStarted()

  return !hasFinished && hasStarted
}

export function getAuctionStartDate() {
  return parseInt(env.get('REACT_APP_AUCTION_START_TIME', 0), 10) // 10th of December 2018 00:00:00 UTC
}

export function getAuctionRealDuration(endTime) {
  const oneDayInSeconds = 60 * 60 * 24
  const startTime = getAuctionStartDate()
  const durationInDays = (endTime - startTime) / oneDayInSeconds
  // The transaction that ends the auction might take a while to finish so we cap the max duration
  return `${
    durationInDays > AUCTION_DURATION_IN_DAYS
      ? AUCTION_DURATION_IN_DAYS
      : durationInDays
  } days`
}
