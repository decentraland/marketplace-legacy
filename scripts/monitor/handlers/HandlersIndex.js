export class HandlersIndex {
  /**
   * @param  {object} handlers - Hash of functions to execute depending on the prop name
   */
  constructor(handlers) {
    this.handlers = handlers
  }

  /**
   * Get a handler from the handlers hash following the following convention
   *   - operation_name_[actions_...]
   *   - operation_name
   *   - name_[actions_...]
   *   - name
   * @param  {string} operation - Executed operation
   * @param  {string} [name]    - Main name
   * @param  {Array<string>} [actions=[]] - Possible actions
   * @return {function} handler
   */
  get(operation, name, actions = []) {
    const parts = [operation]
    const slices = [{ start: 0 }]

    if (name) {
      parts.push(name)
      slices.push({ start: 0, end: -1 })
    }
    if (actions.length) {
      parts.push(actions.join('_'))
      slices.push({ start: 1 })
    }

    if (name) slices.push({ start: 1, end: -1 })

    for (let i = 0; i < slices.length; i++) {
      const { start, end } = slices[i]
      const handlerName = parts.slice(start, end).join('_')
      const handler = this.handlers[handlerName]

      if (handler) {
        return handler
      }
    }
  }
}
