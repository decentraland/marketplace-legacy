import fs from 'fs'

import { resolvePath, expandPath } from './path'

export function runpsql(filename) {
  return `psql $CONNECTION_STRING -f ${resolvePath(filename)}`
}

export function parseCLICoords(coord) {
  if (!coord) throw new Error('You need to supply a coordinate')

  return coord
    .replace('(', '')
    .replace(')', '')
    .split(/\s*,\s*/)
    .map(coord => parseInt(coord.trim(), 10))
}

export function checkContains(base, requirement) {
  const hasRequiredValues = requirement.every(argName => base[argName] != null)

  if (!hasRequiredValues) {
    throw new Error(`Missing required values. Required: "${requirement}"`)
  }
}

export async function readJSONElements(filepath, filterFn) {
  const allElements = filepath ? readJSON(filepath) : []

  console.log('Checking for invalid elements')
  const elements = await filterFn(allElements)

  if (elements.length === 0) {
    throw new Error('No valid elements')
  }

  return elements
}

export function readJSON(filepath) {
  const fileContent = fs.readFileSync(filepath).toString()
  filepath = expandPath(filepath)
  return JSON.parse(fileContent)
}

export * from './actions'
export * from './path'
export * from './transactions'
