import { env } from 'decentraland-commons'

const LOCAL_STORAGE_KEY_BASE = env.get('REACT_APP_LOCAL_STORAGE_KEY_BASE')

const LOCAL_STORAGE_KEY_VERSION = env.get('REACT_APP_LOCAL_STORAGE_KEY_VERSION')

export const LOCAL_STORAGE_KEY = `${LOCAL_STORAGE_KEY_BASE}-${LOCAL_STORAGE_KEY_VERSION}`

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

export function shouldMigrateLocalStorage() {
  return !localStorage.getItem(LOCAL_STORAGE_KEY)
}

export function getOldLocalStorageKey() {
  const version = parseInt(LOCAL_STORAGE_KEY_VERSION.replace('v', ''))

  for (let i = version - 1; i > 0; i--) {
    const key = `${LOCAL_STORAGE_KEY_BASE}-v${i}`
    if (localStorage.getItem(key)) {
      return key
    }
  }
  // the first version did not have '-vX' on it
  return LOCAL_STORAGE_KEY_BASE
}

export function migrateLocalStorage() {
  migration[LOCAL_STORAGE_KEY]()
}

const migration = {
  [LOCAL_STORAGE_KEY]: () => {
    const oldKey = getOldLocalStorageKey()
    const oldLocalStorage = localStorage.getItem(oldKey)
    localStorage.setItem(LOCAL_STORAGE_KEY, oldLocalStorage)
    localStorage.removeItem(oldKey)
  }
}
