import { Publication } from './Publication.model'
import { Parcel } from '../Parcel'
import { Estate } from '../Estate'
import { ASSET_TYPE } from '../shared/asset'

export class PublicationService {
  constructor() {
    this.Publication = Publication
    this.Parcel = Parcel
    this.Estate = Estate
  }

  getModelFromType(type) {
    if (!this.Publication.isValidType(type)) {
      throw new Error(`Invalid publication type "${type}"`)
    }

    return {
      [ASSET_TYPE.parcel]: this.Parcel,
      [ASSET_TYPE.estate]: this.Estate
    }[type]
  }
}
