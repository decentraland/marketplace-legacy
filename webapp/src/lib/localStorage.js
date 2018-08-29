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
