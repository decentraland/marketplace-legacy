import { env } from 'decentraland-commons'

export const LOCAL_STORAGE_KEY = env.get('REACT_APP_LOCAL_STORAGE_KEY')

export function hasLocalStorage() {
  try {
    const localStorage = window.localStorage
    const val = 'val'
    localStorage.setItem(val, val)
    localStorage.removeItem(val)
    return true
  } catch (e) {
    return false
  }
}

export const localStorage = hasLocalStorage()
  ? window.localStorage
  : { getItem: () => {}, setItem: () => {}, removeItem: () => {} }

export function migrateLocalStorage() {
  const dataString = localStorage.getItem(LOCAL_STORAGE_KEY)
  const data = JSON.parse(dataString)
  let version = parseInt(data.storage.version || 0) + 1
  while (hasMigrateFunction(version)) {
    migrations[version](data, version)
    version++
  }
}

function hasMigrateFunction(version) {
  return !!migrations[version]
}

const migrations = {
  '1': (data, version) => {
    const dataString = JSON.stringify({ ...data, storage: { version } })
    localStorage.setItem(LOCAL_STORAGE_KEY, dataString)
  }
}
