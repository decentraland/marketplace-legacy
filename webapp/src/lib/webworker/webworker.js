import { WebWorkerFactory } from './WebWorkerFactory'
import { WebWorkerOnMessage } from './WebWorkerOnMessage'
import {
  toParcelObject,
  normalizeParcel,
  connectParcel,
  areConnected,
  isSameValue,
  getParcelPublications,
  buildCoordinate
} from 'shared/parcel'

const WebWorkerDependencies = {
  toParcelObject,
  normalizeParcel,
  connectParcel,
  areConnected,
  isSameValue,
  getParcelPublications,
  buildCoordinate
}

export const webworker = WebWorkerFactory.create(
  WebWorkerOnMessage,
  WebWorkerDependencies
)
