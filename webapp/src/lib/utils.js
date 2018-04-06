import dateFnsFormat from 'date-fns/format'
import dateFnsDistanceInWordsToNow from 'date-fns/distance_in_words_to_now'

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

export const requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  (callback => setTimeout(callback, 1000 / 60))

export const cancelAnimationFrame =
  window.cancelAnimationFrame ||
  window.mozCancelAnimationFrame ||
  window.webkitCancelAnimationFrame ||
  window.msCancelAnimationFrame ||
  (id => clearTimeout(id))

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
  const amountNumber = parseFloat(amount, 10)
  return `${amountNumber.toLocaleString()} ${unit}`.trim()
}

export function formatDate(date, format = 'MMMM Do, YYYY - hh:MMa') {
  return dateFnsFormat(date, format)
}

export function distanceInWordsToNow(date) {
  return dateFnsDistanceInWordsToNow(date, {
    addSuffix: true,
    locale: getCurrentLocale()
  })
}

export function openPopup(url, title, w, h) {
  var dualScreenLeft =
    window.screenLeft !== undefined ? window.screenLeft : window.screenX
  var dualScreenTop =
    window.screenTop !== undefined ? window.screenTop : window.screenY

  var width = window.innerWidth
    ? window.innerWidth
    : document.documentElement.clientWidth
      ? document.documentElement.clientWidth
      : global.screen.width
  var height = window.innerHeight
    ? window.innerHeight
    : document.documentElement.clientHeight
      ? document.documentElement.clientHeight
      : global.screen.height

  var left = width / 2 - w / 2 + dualScreenLeft
  var top = height / 2 - h / 2 + dualScreenTop
  var newWindow = window.open(
    url,
    title,
    'scrollbars=yes, width=' +
      w +
      ', height=' +
      h +
      ', top=' +
      top +
      ', left=' +
      left
  )

  if (window.focus) {
    newWindow.focus()
  }
}
