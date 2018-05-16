// From https://github.com/felixfbecker/node-sql-template-queryParts
// Modified to support nested sql statements and `raw`

export class SQLStatement {
  /**
   * @param {string[]} queryParts
   * @param {any[]} values
   */
  constructor(queryParts, values) {
    this.queryParts = queryParts.slice(0)
    this.values = []

    let index = 0
    let nestedIndex = 0

    for (; index < values.length; index++, nestedIndex++) {
      const statement = values[index]

      if (statement instanceof SQLStatement) {
        // handle nested sql statement
        if (statement.values.length > 0) {
          const { left, middle, right } = this.splitNestedStatement(
            statement,
            nestedIndex
          )

          this.queryParts.splice(nestedIndex, 2, left, ...middle, right)
          this.values.push(...statement.values)

          nestedIndex += middle.length
        } else {
          const fullQueryPart =
            this.queryParts[nestedIndex] +
            statement.queryParts[0] +
            this.queryParts[nestedIndex + 1]

          this.queryParts.splice(nestedIndex, 2, fullQueryPart)
          nestedIndex -= 1
        }
      } else {
        this.values.push(statement)
      }
    }
  }

  splitNestedStatement({ queryParts }, index) {
    const left = this.queryParts[index] + queryParts[0]
    const middle = queryParts.slice(1, queryParts.length - 1)
    const right = queryParts[queryParts.length - 1] + this.queryParts[index + 1]

    return { left, middle, right }
  }

  /** Returns the SQL Statement for node-postgres */
  get text() {
    return this.queryParts.reduce(
      (prev, curr, index) => prev + '$' + index + curr
    )
  }

  /**
   * @param {SQLStatement|string} statement
   * @returns {this}
   */
  append(statement) {
    if (statement instanceof SQLStatement) {
      this.queryParts[this.queryParts.length - 1] += statement.queryParts[0]
      this.queryParts.push.apply(this.queryParts, statement.queryParts.slice(1))

      const values = this.values
      values.push.apply(this.values, statement.values)
    } else {
      this.queryParts[this.queryParts.length - 1] += statement
    }
    return this
  }

  /**
   * @param {string} name
   * @returns {this}
   */
  setName(name) {
    this.name = name
    return this
  }
}

/** Returns the SQL Statement for mysql */
Object.defineProperty(SQLStatement.prototype, 'sql', {
  enumerable: true,
  get() {
    return this.queryParts.join('?')
  }
})

/**
 * @param {string[]} queryParts
 * @param {...any} values
 * @returns {SQLStatement}
 */
export function SQL(queryParts, ...args) {
  return new SQLStatement(queryParts, args)
}

export function raw(value) {
  return SQL([value])
}

SQL.raw = raw
