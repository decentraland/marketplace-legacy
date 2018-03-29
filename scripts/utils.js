// node compatible

const path = require('path')
const { env } = require('decentraland-commons')

function loadEnv(envFilePath = '../src/.env') {
  env.load({ path: resolve(envFilePath) })
}

function resolve(destination) {
  return path.resolve(getDirname(), destination)
}

function getDirname() {
  return path.dirname(require.main.filename)
}

function parseCLICoords(coord) {
  if (!coord) throw new Error('You need to supply a coordinate')

  return coord
    .replace('(', '')
    .replace(')', '')
    .split(/\s*,\s*/)
    .map(coord => parseInt(coord.trim(), 10))
}

module.exports = {
  loadEnv,
  resolve,
  parseCLICoords
}
