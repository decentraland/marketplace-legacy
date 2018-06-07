import { Publication } from './Publication.model'
import { Parcel } from '../Parcel'
import { Estate } from '../Estate'
import { PUBLICATION_TYPES } from '../shared/publication'

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
      [PUBLICATION_TYPES.parcel]: this.Parcel,
      [PUBLICATION_TYPES.estate]: this.Estate
    }[type]
  }
}
