import { Publication } from './Publication.model'
import { Parcel } from '../Parcel'
import { State } from '../State'

export class PublicationService {
  constructor() {
    this.Publication = Publication
    this.Parcel = Parcel
    this.State = State
  }

  getModelFromType(type) {
    if (!this.Publication.isValidType(type)) {
      throw new Error(`Invalid publication type "${type}"`)
    }

    return {
      [this.Publication.TYPES.parcel]: this.Parcel,
      [this.Publication.TYPES.state]: this.State
    }[type]
  }
}
