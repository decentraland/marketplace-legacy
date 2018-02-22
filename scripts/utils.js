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

module.exports = {
  loadEnv,
  resolve
}
