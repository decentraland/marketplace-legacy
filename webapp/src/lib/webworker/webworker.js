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
  ['toParcelObject', toParcelObject],
  ['normalizeParcel', normalizeParcel],
  ['connectParcels', connectParcels],
  ['isSameValue', isSameValue],
  ['getParcelPublications', getParcelPublications],
  ['buildCoordinate', buildCoordinate]
]

export const webworker = WebWorkerFactory.create(
  WebWorkerOnMessage,
  WebWorkerDependencies
)
