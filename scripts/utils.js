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

function parseCLICoords(coords) {
  return coords
    .replace('(', '')
    .replace(')', '')
    .slice(/\s*,\s*/)
    .trim()
}

module.exports = {
  loadEnv,
  resolve,
  parseCLICoords
}
