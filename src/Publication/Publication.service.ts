import { Estate, Parcel } from '../Asset'
import { Publication } from './Publication.model'

export class PublicationService {
  Publication: typeof Publication
  Parcel: typeof Parcel
  Estate: typeof Estate

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
      [this.Publication.TYPES.parcel]: this.Parcel,
      [this.Publication.TYPES.estate]: this.Estate
    }[type]
  }
}
