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
  let version = null
  try {
    const dataString = localStorage.getItem(LOCAL_STORAGE_KEY)
    const data = JSON.parse(dataString)
    version = parseInt(data.storage.version || 0) + 1
    while (hasMigrateFunction(version)) {
      const newData = migrations[version](data, version)
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData))
      version++
    }
  } catch (error) {
    window.Rollbar.info(
      `Failed to migrate the user localstorage to version ${version}`,
      error
    )
  }
}

function hasMigrateFunction(version) {
  return !!migrations[version]
}

const migrations = {
  '1': (data, version) => ({ ...data, storage: { version } })
}
