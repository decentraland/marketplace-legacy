/// <reference types="node" />

interface QueryArgument {
  text: string
  values: any[]
}
interface QueryPart {
  [name: string]: string
}

declare module 'decentraland-commons' {
  export interface db {
    connect(connectionString: string): void
    query(
      queryString: string | QueryArgument,
      values?: any[]
    ): Promise<Array<any>>
  }

  export class Model {
    static tableName: string
    static columnNames: Array<string>
    static primaryKey: string

    static db: db

    static find(
      conditions?: QueryPart,
      orderBy?: QueryPart,
      extra?: string
    ): Promise<any[]>

    static findOne(
      primaryKeyOrCond: string|number|QueryPart,
      orderBy?: QueryPart
    ): Promise<any>
  }
}
