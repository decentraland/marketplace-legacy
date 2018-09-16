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
  let version = 1 // initial value for versions
  try {
    const dataString = localStorage.getItem(LOCAL_STORAGE_KEY)
    const data = JSON.parse(dataString)
    if (data.storage) {
      version = parseInt(data.storage.version || 0) + 1
    }
    while (hasMigrateFunction(version)) {
      const newData = migrations[version](data)
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({ ...newData, storage: { version } })
      )
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
  '1': data => data,
  '2': data => {
    const transaction = data.transaction
    if (transaction && transaction.data) {
      transaction.data = transaction.data.map(tx => {
        return {
          ...tx,
          receipt: null // Remove previous receipt. Will save receipt on demand
        }
      })
    }
    return { ...data, transaction }
  }
}
