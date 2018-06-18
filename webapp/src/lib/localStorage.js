function getLocalStorage() {
  try {
    const localStorage = window.localStorage
    const val = 'val'
    localStorage.setItem(val, val)
    localStorage.removeItem(val)
    return localStorage
  } catch (e) {
    return { getItem: () => {}, setItem: () => {}, removeItem: () => {} }
  }
}

export const localStorage = getLocalStorage()
