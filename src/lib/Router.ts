import * as express from 'express'

export class Router {
  protected app: express.Application

  constructor(app: express.Application) {
    this.app = app
  }

  mount(): void {
    throw new Error('Not implemented')
  }
}
