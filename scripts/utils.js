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

function asSafeAction(callback) {
  return async function(...args) {
    try {
      await callback(...args)
    } catch (error) {
      console.error(error.message)
      console.log(error)
    } finally {
      process.exit()
    }
  }
}

module.exports = {
  loadEnv,
  runpsql,
  resolvePath,
  parseCLICoords,
  asSafeAction
}
