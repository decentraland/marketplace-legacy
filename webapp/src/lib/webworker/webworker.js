import { WebWorkerFactory } from './WebWorkerFactory'
import { WebWorkerOnMessage } from './WebWorkerOnMessage'
import {
  toParcelObject,
  normalizeParcel,
  connectParcel,
  areConnected,
  isSameValue,
  buildCoordinate
} from 'shared/parcel'
import { getAssetPublications } from 'shared/asset'
import { toEstateObject, normalizeEstate } from 'shared/estate'

const WebWorkerDependencies = {
  toParcelObject,
  normalizeParcel,
  connectParcel,
  areConnected,
  isSameValue,
  getAssetPublications,
  buildCoordinate,
  toEstateObject,
  normalizeEstate
}

export const webworker = WebWorkerFactory.create(
  WebWorkerOnMessage,
  WebWorkerDependencies
)
