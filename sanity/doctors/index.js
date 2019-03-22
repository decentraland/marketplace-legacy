import { ParcelDoctor } from './ParcelDoctor'
import { PublicationDoctor } from './PublicationDoctor'
import { EstateDoctor } from './EstateDoctor'

export const doctors = {
  Estate: EstateDoctor,
  Parcel: ParcelDoctor,
  Publication: PublicationDoctor
}
