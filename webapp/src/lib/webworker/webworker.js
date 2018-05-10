import { WebWorkerFactory } from './WebWorkerFactory'
import { WebWorkerOnMessage } from './WebWorkerOnMessage'

export const webworker = WebWorkerFactory.create(WebWorkerOnMessage)
