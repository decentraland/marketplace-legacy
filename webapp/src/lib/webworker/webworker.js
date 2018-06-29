import { WebWorkerFactory } from './WebWorkerFactory'
import { WebWorkerOnMessage } from './WebWorkerOnMessage'
import {
  toParcelObject,
  normalizeParcel,
  connectParcels,
  areConnected,
  getParcelPublications,
  buildCoordinate
} from 'shared/parcel'

const WebWorkerDependencies = [
  ['toParcelObject', toParcelObject],
  ['normalizeParcel', normalizeParcel],
  ['connectParcels', connectParcels],
  ['areConnected', areConnected],
  ['getParcelPublications', getParcelPublications],
  ['buildCoordinate', buildCoordinate]
]

export const webworker = WebWorkerFactory.create(
  WebWorkerOnMessage,
  WebWorkerDependencies
)
