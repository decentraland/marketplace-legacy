import { ParcelDoctor } from './ParcelDoctor'
import { PublicationDoctor } from './PublicationDoctor'
import { EstateDoctor } from './EstateDoctor'
import { ApprovalDoctor } from './ApprovalDoctor'

// Publications should be treated first in order to avoid inconsistencies for orders
// where they're not cancelled when changing the owner of the asset
export const doctors = {
  Publication: PublicationDoctor,
  Estate: EstateDoctor,
  Parcel: ParcelDoctor,
  Approval: ApprovalDoctor
}
