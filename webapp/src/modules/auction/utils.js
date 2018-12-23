import { env } from 'decentraland-commons'
import { eth } from 'decentraland-eth'

import { localStorage } from 'lib/localStorage'
import { api } from 'lib/api'

export const TOKEN_ADDRESSES = {
  MANA: env.get('REACT_APP_MANA_TOKEN_CONTRACT_ADDRESS'),
  BNB: env.get('REACT_APP_BNB_TOKEN_CONTRACT_ADDRESS'),
  DAI: env.get('REACT_APP_DAI_TOKEN_CONTRACT_ADDRESS'),
  ELF: env.get('REACT_APP_ELF_TOKEN_CONTRACT_ADDRESS'),
  KNC: env.get('REACT_APP_KNC_TOKEN_CONTRACT_ADDRESS'),
  MKR: env.get('REACT_APP_MKR_TOKEN_CONTRACT_ADDRESS'),
  SNT: env.get('REACT_APP_SNT_TOKEN_CONTRACT_ADDRESS'),
  ZIL: env.get('REACT_APP_ZIL_TOKEN_CONTRACT_ADDRESS'),
  RCN: env.get('REACT_APP_RCN_TOKEN_CONTRACT_ADDRESS')
}

export const TOKEN_SYMBOLS = Object.keys(TOKEN_ADDRESSES) // array of token symbols

export const TOKEN_MAX_CONVERSION_AMOUNT = {
  BNB: parseInt(
    env.get('REACT_APP_BNB_MAX_CONVERSION_AMOUNT', 2909855240000),
    10
  ),
  DAI: parseInt(
    env.get('REACT_APP_DAI_MAX_CONVERSION_AMOUNT', 20000000000000),
    10
  ),
  ELF: parseInt(
    env.get('REACT_APP_ELF_MAX_CONVERSION_AMOUNT', 120766092000000),
    10
  ),
  KNC: parseInt(
    env.get('REACT_APP_KNC_MAX_CONVERSION_AMOUNT', 102782086000000),
    10
  ),
  MKR: parseInt(
    env.get('REACT_APP_MKR_MAX_CONVERSION_AMOUNT', Number.MAX_SAFE_INTEGER),
    10
  ),
  SNT: parseInt(
    env.get('REACT_APP_SNT_MAX_CONVERSION_AMOUNT', 887995199000000),
    10
  ),
  ZIL: parseInt(env.get('REACT_APP_ZIL_MAX_CONVERSION_AMOUNT', 968084905), 10),
  RCN: parseInt(
    env.get('REACT_APP_RCN_MAX_CONVERSION_AMOUNT', 87420000000000),
    10
  )
}

export const AUCTION_HELPERS = Object.freeze({
  SEEN_AUCTION_MODAL: 'seenAuctionModal',
  SEEN_AUCTION_TOKEN_TOOLTIP: 'seenAuctionTokenTooltip',
  SUBSCRIBED_TO_AUCTION_BY_EMAIL: 'subscribedToAuction'
})

export const AUCTION_DURATION_IN_DAYS = 15

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

export function getConversionFee() {
  return parseInt(env.get('REACT_APP_AUCTION_CONVERSION_FEE', 105), 10)
}

export function getConversionFeePercentage() {
  const conversionFee = getConversionFee()
  return conversionFee - 100
}

export function addConversionFee(price) {
  const conversionFee = getConversionFee()
  return price * conversionFee / 100
}

export async function hasAuctionFinished() {
  const landAuction = eth.getContract('LANDAuction')
  const endTime = await landAuction.endTime()
  const availableParcelCount = await api.fetchAvaialableParcelCount()
  return (
    availableParcelCount === 0 ||
    (endTime.toNumber() > 0 && Date.now() / 1000 >= endTime.toNumber())
  )
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
  if (auctionRealDurationInDays) {
    return parseInt(auctionRealDurationInDays, 10)
  }

  const oneDayInSeconds = 60 * 60 * 24
  const startTime = getAuctionStartDate()
  const durationInDays = (endTime - startTime / 1000) / oneDayInSeconds

  // The transaction that ends the auction might take a while to finish so we cap the max duration
  return `${
    durationInDays > AUCTION_DURATION_IN_DAYS
      ? AUCTION_DURATION_IN_DAYS
      : Math.ceil(durationInDays)
  } days`
}

export const duration = {
  seconds: function(val) {
    return val
  },
  minutes: function(val) {
    return val * this.seconds(60)
  },
  hours: function(val) {
    return val * this.minutes(60)
  },
  days: function(val) {
    return val * this.hours(24)
  },
  weeks: function(val) {
    return val * this.days(7)
  },
  years: function(val) {
    return val * this.days(365)
  }
}

export const initialPrice = eth.utils.toWei(
  env.get('REACT_APP_AUCTION_INITIAL_PRICE', 200000),
  'ether'
)
export const endPrice = eth.utils.toWei(
  env.get('REACT_APP_AUCTION_END_PRICE', 1000),
  'ether'
)
export const prices = [
  initialPrice,
  eth.utils.toWei(env.get('REACT_APP_AUCTION_SECOND_PRICE', 100000), 'ether'),
  eth.utils.toWei(env.get('REACT_APP_AUCTION_THIRD_PRICE', 50000), 'ether'),
  eth.utils.toWei(env.get('REACT_APP_AUCTION_FOURTH_PRICE', 25000), 'ether'),
  endPrice
]
export const auctionRealDurationInDays = env.get(
  'REACT_APP_AUCTION_REAL_DURATION_IN_DAYS'
)
export const auctionDuration = duration.days(15)
export const time = [
  0,
  duration.days(1),
  duration.days(2),
  duration.days(7),
  auctionDuration
]

export function getFunc(_time) {
  for (let i = 0; i < time.length - 1; i++) {
    const x1 = time[i]
    const x2 = time[i + 1]
    const y1 = prices[i]
    const y2 = prices[i + 1]
    if (_time < x2) {
      return { x1, x2, y1, y2 }
    }
  }
}

export function parseFloatWithDecimal(num, decimals = 0) {
  return parseFloat(parseFloat(num).toFixed(decimals))
}

export function weiToDecimal(num) {
  return parseFloatWithDecimal(eth.utils.fromWei(num))
}

export function getPriceWithLinearFunction(time, toWei = true) {
  const { x1, x2, y1, y2 } = getFunc(time)

  const b = (x2 * y1 - x1 * y2) * 10 ** 18 / (x2 - x1)
  const slope = (y1 - y2) * time * 10 ** 18 / (x2 - x1)
  let price = (b - slope) / 10 ** 18

  if (time <= 0) {
    price = initialPrice
  } else if (time >= auctionDuration) {
    price = endPrice
  }

  if (toWei) {
    return eth.utils.fromWei(price)
  }
  return price
}
