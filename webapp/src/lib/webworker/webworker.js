import { WebWorkerFactory } from './WebWorkerFactory'
import { WebWorkerOnMessage } from './WebWorkerOnMessage'
import { getAssetPublications } from 'shared/asset'
import { toParcelObject } from 'shared/parcel'
import { toEstateObject, normalizeEstate } from 'shared/estate'

const WebWorkerDependencies = {
  toParcelObject,
  getAssetPublications,
  toEstateObject,
  normalizeEstate
}

export const webworker = WebWorkerFactory.create(
  WebWorkerOnMessage,
  WebWorkerDependencies
)
