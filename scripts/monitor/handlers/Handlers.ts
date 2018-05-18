export class Handlers {
  handlers: { [key: string]: Function }

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
   *   - operation
   * @param  {string} operation - Executed operation
   * @param  {string} [name]    - Main name
   * @param  {Array<string>} [actions=[]] - Possible actions
   * @return {function} handler
   */
  get(
    operation: string,
    name: string,
    actions: string[] = []
  ): Function | void {
    const parts: string[] = [operation]
    const slices: { start: number; end?: number }[] = [{ start: 0 }]

    if (name) {
      parts.push(name)
      slices.push({ start: 0, end: -1 })
    }
    if (actions.length) {
      parts.push(actions.join('_'))
      slices.push({ start: 1 })
    }
    if (name) slices.push({ start: 1, end: -1 })

    slices.push({ start: 0, end: 1 })

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
