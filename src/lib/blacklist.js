const timestamps = ['created_at', 'updated_at']

const parcel = ['asset_id', ...timestamps]
const state = [...timestamps]

const asset = new Set(parcel.concat(state))

export const blacklist = Object.freeze({
  parcel,
  state,
  asset: Array.from(asset),
  publication: ['asset_id', ...timestamps],
  contribution: ['message', 'signature', ...timestamps],
  district: ['disabled', 'address', 'parcel_ids', ...timestamps]
})
