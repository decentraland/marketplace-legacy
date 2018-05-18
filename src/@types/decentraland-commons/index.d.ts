/// <reference types="node" />
/// <reference types="express" />

declare module 'decentraland-commons' {
  import * as express from 'express'

  interface QueryArgument {
    text: string
    values: any[]
  }
  interface QueryPart {
    [name: string]: any
  }
  interface Column {
    [columnName: string]: any
  }

  interface Env {
    load(options?: { path?: string; values?: any }): void
    get<T>(name: string, defaultValue?: T): string | T
    isDevelopment(): boolean
    isProduction(): boolean
    isTest(): boolean
  }
  interface Server {
    useRollbar(accessToken: string): void
    handleRequest(
      callback: (req: express.Request, res: express.Response) => void
    ): express.RequestHandler
    extractFromReq(req: express.Request, param: string): string
  }
  interface Db {
    postgres: {
      connect(connectionString?: string): Promise<void>
      query(queryString: string | QueryArgument, values?: any[]): Promise<any[]>
      truncate(tableName: string): Promise<void>
      close(): Promise<void>

      toColumnFields(columns: Column): string[]
      toValuePlaceholders(columns: Column, start?: number): string[]
    }
  }
  interface Cli {
    runProgram(clients: { addCommands: (program: any) => void }[])
    confirm(text?: string, defaultAnswer?: boolean)
    prompt(questions: any[])
  }
  interface Utils {
    promisify<T = any>(fn)
    sleep(ms: number): Promise<void>
    isEmptyObject(obj: any): boolean
    omit<T>(obj: T, keys: string[]): T
    mapOmit<T>(array: T[], keys: string[]): T[]
    pick<T>(obj: T, keys: string[]): T
  }

  export const env: Env
  export const server: Server
  export const db: Db
  export const cli: Cli
  export const utils: Utils

  export class Log {
    constructor(name: string)

    debug(...args: any[]): string
    warn(...args: any[]): string
    info(...args: any[]): string
    error(...args: any[]): string
    trace(...args: any[]): string
  }

  export class Model {
    public static tableName: string
    public static columnNames: string[]
    public static primaryKey: string

    static db: Db['postgres']

    static find(
      conditions?: QueryPart,
      orderBy?: QueryPart,
      extra?: string
    ): Promise<any>
    static find<T>(
      conditions?: QueryPart,
      orderBy?: QueryPart,
      extra?: string
    ): Promise<T[]>

    static findOne(
      primaryKeyOrCond: string | number | QueryPart,
      orderBy?: QueryPart
    ): Promise<any>
    static findOne<T>(
      primaryKeyOrCond: string | number | QueryPart,
      orderBy?: QueryPart
    ): Promise<T>

    static count(conditions: QueryPart): Promise<number>
    static insert<T>(row: T): Promise<T>
    static update(changes: QueryPart, conditions: QueryPart)
    static delete(conditions: QueryPart)

    public attributes: any

    constructor(attributes?: any)
  }
}
