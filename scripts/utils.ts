import { env } from 'decentraland-commons'
import * as path from 'path'

export function loadEnv(envFilePath: string = '../src/.env') {
  env.load({ path: resolvePath(envFilePath) })
}

export function runpsql(filename: string) {
  return `psql $CONNECTION_STRING -f ${resolvePath(filename)}`
}

export function resolvePath(destination: string) {
  return path.resolve(getDirname(), destination)
}

export function getDirname() {
  return path.dirname(require.main.filename)
}

export function parseCLICoords(coord: string) {
  if (!coord) throw new Error('You need to supply a coordinate')

  return coord
    .replace('(', '')
    .replace(')', '')
    .split(/\s*,\s*/)
    .map(coord => parseInt(coord.trim(), 10))
}
