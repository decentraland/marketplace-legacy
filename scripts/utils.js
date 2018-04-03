// node compatible

const path = require('path')
const { env } = require('decentraland-commons')

function loadEnv(envFilePath = '../src/.env') {
  env.load({ path: resolvePath(envFilePath) })
}

function runpsql(filename) {
  return `psql $CONNECTION_STRING -f ${resolvePath(filename)}`
}

function resolvePath(destination) {
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
  runpsql,
  resolvePath,
  parseCLICoords
}
