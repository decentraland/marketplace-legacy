interface Blacklist {
  parcel: string[]
  state: string[]
  asset: string[]
  publication: string[]
  contribution: string[]
  district: string[]
}

const timestamps = ['created_at', 'updated_at']

const parcel = ['asset_id', ...timestamps]
const estate = [...timestamps]

const asset = new Set(parcel.concat(estate))

export const blacklist: Blacklist = Object.freeze({
  parcel,
  estate,
  asset: Array.from(asset),
  publication: ['asset_id', ...timestamps],
  contribution: ['message', 'signature', ...timestamps],
  district: ['disabled', 'address', 'parcel_ids', ...timestamps]
})
