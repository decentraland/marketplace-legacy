import path from 'path'
import { env } from 'decentraland-commons'

export function loadEnv(envFilePath = '../src/.env') {
  env.load({ path: resolvePath(envFilePath) })
}

export function resolvePath(destination) {
  return path.resolve(getDirname(), destination)
}

export function getDirname() {
  return path.dirname(require.main.filename)
}

export function expandPath(path) {
  if (!path) throw new Error(`Invalid path ${path}`)
  return ['.', '/'].includes(path[0]) ? path : `${__dirname}/${path}`
}
