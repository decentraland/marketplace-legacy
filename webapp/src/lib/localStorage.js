export const localStorage = window.localStorage || {
  getItem: () => {},
  setItem: () => {},
  removeItem: () => {}
}
