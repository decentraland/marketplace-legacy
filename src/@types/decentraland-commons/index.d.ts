/// <reference types="node" />
/// <reference types="express" />

declare module 'decentraland-commons' {
  import * as express from 'express'

  interface QueryArgument {
    text: string
    values: any[]
  }
  interface QueryPart {
    [name: string]: string
  }

  interface Env {
    get(name: string): string
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
      connect(connectionString: string): void
      query(queryString: string | QueryArgument, values?: any[]): Promise<any[]>
      truncate(tableName: string): Promise<void>
      close(): Promise<void>
    }
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
  export const utils: Utils
  export const db: Db

  export class Model {
    static tableName: string
    static columnNames: string[]
    static primaryKey: string

    static db: Db['postgres']

    static find(
      conditions?: QueryPart,
      orderBy?: QueryPart,
      extra?: string
    ): Promise<any[]>

    static findOne(
      primaryKeyOrCond: string | number | QueryPart,
      orderBy?: QueryPart
    ): Promise<any>
  }
}
