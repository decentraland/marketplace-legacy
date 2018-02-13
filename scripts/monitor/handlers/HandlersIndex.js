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
   *   - name_[actions_...]
   *   - [actions...]
   * @param  {string} operation - Executed operation
   * @param  {string} [name]    - Main name
   * @param  {Array<string>} [actions=[]] - Possible actions
   * @return {function} handler
   */
  get(operation, name, actions = []) {
    const parts = [operation]

    if (name) parts.push(name)
    if (actions.length) parts.push(actions.join('_'))

    for (let i = 0; i < parts.length; i++) {
      const handlerName = parts.slice(i).join('_')
      const handler = this.handlers[handlerName]

      if (handler) {
        return handler
      }
    }
  }
}
