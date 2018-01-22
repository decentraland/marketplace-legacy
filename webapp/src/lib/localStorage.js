const localStorage = window.localStorage || {
  getItem: () => {},
  setItem: () => {},
  removeItem: () => {}
}

export default localStorage
