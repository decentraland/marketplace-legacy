import { WebWorkerFactory } from './WebWorkerFactory'
import { WebWorkerOnMessage } from './WebWorkerOnMessage'
import {
  toParcelObject,
  normalizeParcel,
  connectParcels,
  isSameValue,
  getParcelPublications,
  buildCoordinate
} from 'shared/parcel'

const WebWorkerDependencies = [
  toParcelObject,
  normalizeParcel,
  connectParcels,
  isSameValue,
  getParcelPublications,
  buildCoordinate
]

export const webworker = WebWorkerFactory.create(
  WebWorkerOnMessage,
  WebWorkerDependencies
)
