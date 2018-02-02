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

const prettyAmount = amount => parseFloat(amount.toFixed(1))

export function format(amount, unit = 'MANA') {
  if (amount < 1000) {
    return `${amount} MANA`
  } else if (amount < 1000000) {
    return `${prettyAmount(amount / 1000)}K MANA`
  } else if (amount < 1000000000) {
    return `${prettyAmount(amount / 1000000)}M MANA`
  } else {
    return `${prettyAmount(amount / 1000000000)}G MANA`
  }
}
