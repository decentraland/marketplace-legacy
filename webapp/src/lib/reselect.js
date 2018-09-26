export const lazy = selectorFactory => {
  let selector
  return state => {
    if (!selector) {
      selector = selectorFactory()
    }
    return selector(state)
  }
}
