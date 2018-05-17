// From https://github.com/felixfbecker/node-sql-template-queryParts
// Modified to support nested sql statements and `raw`

export class SQLStatement {
  queryParts: string[]
  values: any[]
  name: string

  constructor(queryParts: TemplateStringsArray, values: any[]) {
    this.queryParts = queryParts.slice(0)
    this.values = []

    let index = 0
    let nestedIndex = 0

    for (; index < values.length; index++, nestedIndex++) {
      const statement = values[index]

      if (statement instanceof SQLStatement) {
        // handle nested sql statement
        if (statement.values.length > 0) {
          const left = this.getLeftQueryPart(statement.queryParts, nestedIndex)
          const middle = this.getMiddleQueryParts(statement.queryParts)
          const right = this.getRightQueryPart(
            statement.queryParts,
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

  getLeftQueryPart(queryParts: string[], index: number): string {
    return this.queryParts[index] + queryParts[0]
  }

  getMiddleQueryParts(queryParts: string[]): string[] {
    return queryParts.slice(1, queryParts.length - 1)
  }

  getRightQueryPart(queryParts: string[], index: number): string {
    return queryParts[queryParts.length - 1] + this.queryParts[index + 1]
  }

  /** Returns the SQL Statement for node-postgres */
  get text(): string {
    return this.queryParts.reduce(
      (prev, curr, index) => prev + '$' + index + curr
    )
  }

  append(statement: SQLStatement | string): SQLStatement {
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

  setName(name: string): SQLStatement {
    this.name = name
    return this
  }
}

interface SQLInterface {
  (queryParts: TemplateStringsArray | string[], ...args: any[]): SQLStatement
  raw(value: any): SQLStatement
}

export const SQL: SQLInterface = function(queryParts, ...args) {
  return new SQLStatement(queryParts, args)
} as any

export function raw(value: string | number): SQLStatement {
  return SQL([value.toString()])
}

SQL.raw = raw
