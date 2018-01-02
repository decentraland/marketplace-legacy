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
