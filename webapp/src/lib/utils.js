import dateFnsFormat from 'date-fns/format'
import dateFnsDistanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import { txUtils } from 'decentraland-eth'

import { getCurrentLocale } from 'modules/translation/utils'

export function buildCoordinate(x, y) {
  return `${x},${y}`
}

export function splitCoordinate(id) {
  return id ? id.split(',') : [0, 0]
}

export function preventDefault(fn) {
  return function(event) {
    if (event) {
      event.preventDefault()
    }
    fn.call(this, event)
  }
}

export function shortenAddress(address) {
  if (address) {
    return address.slice(0, 6) + '...' + address.slice(42 - 5)
  }
}

export function insertScript({
  type = 'text/javascript',
  async = true,
  ...props
}) {
  const script = document.createElement('script')
  Object.assign(script, { type, async: async, ...props }) // WARN, babel breaks on `{ async }`

  document.body.appendChild(script)

  return script
}

export function isMobileWidth(width = window.outerWidth) {
  return width <= 768
}

export function isMobile() {
  // WARN: Super naive mobile device check.
  // we're using it on low-stake checks, where failing to detect some browsers is not a big deal.
  // If you need more specificity you may want to change this implementation.
  const navigator = window.navigator

  return (
    /Mobi/i.test(navigator.userAgent) || /Android/i.test(navigator.userAgent)
  )
}

export function formatMana(amount, unit = 'MANA') {
  const amountNumber = parseFloat(amount)
  return `${amountNumber.toLocaleString()} ${unit}`.trim()
}

export function formatDate(date, format = 'MMMM Do, YYYY - hh:MMa') {
  return dateFnsFormat(date, format, {
    locale: getCurrentLocale()
  })
}

export function distanceInWordsToNow(date) {
  return dateFnsDistanceInWordsToNow(date, {
    addSuffix: true,
    locale: getCurrentLocale()
  })
}

/**
 * Returns if a date is expired
 * @param {number} - expires_at
 * @returns {boolean}
 */
export function isExpired(expires_at) {
  return parseInt(expires_at, 10) < Date.now()
}

/**
 * Returns if object is Open
 * @param {object} - obj with status & tx_status fields
 * @param  {string} - status
 * @returns {boolean}
 */
export function isOpen(obj, status) {
  return hasStatus(obj, status)
}

/**
 * Returns if object has status
 * @param {object} - obj with status & tx_status fields
 * @param  {string} - status
 * @returns {boolean}
 */
export function hasStatus(obj, status) {
  return (
    obj &&
    obj.status === status &&
    obj.tx_status === txUtils.TRANSACTION_STATUS.confirmed &&
    !isExpired(obj)
  )
}
