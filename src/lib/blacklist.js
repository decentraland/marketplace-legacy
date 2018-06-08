const timestamps = ['created_at', 'updated_at']

const parcel = ['asset_id', ...timestamps]
const estate = [...timestamps]

const asset = new Set(parcel.concat(estate))

export const blacklist = Object.freeze({
  parcel,
  estate,
  asset: Array.from(asset),
  publication: [...timestamps],
  contribution: ['message', 'signature', ...timestamps],
  district: ['disabled', 'address', 'parcel_ids', ...timestamps]
})
