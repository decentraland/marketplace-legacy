export function brighten(hex, percent) {
  // strip the leading # if it's there
  hex = hex.replace(/^\s*#|\s*$/g, '')

  var r = parseInt(hex.substr(0, 2), 16),
    g = parseInt(hex.substr(2, 2), 16),
    b = parseInt(hex.substr(4, 2), 16)

  return (
    '#' +
    (0 | ((1 << 8) + r + (256 - r) * percent)).toString(16).substr(1) +
    (0 | ((1 << 8) + g + (256 - g) * percent)).toString(16).substr(1) +
    (0 | ((1 << 8) + b + (256 - b) * percent)).toString(16).substr(1)
  )
}
