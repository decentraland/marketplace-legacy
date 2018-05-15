const parcel = ['asset_id', 'created_at', 'updated_at']
const state = ['created_at', 'updated_at']

const asset = new Set(parcel.concat(state))

export const blacklist = Object.freeze({
  parcel,
  state,
  asset: Array.from(asset),
  publication: ['asset_id', 'created_at', 'updated_at'],
  contribution: ['message', 'signature', 'created_at', 'updated_at'],
  district: ['disabled', 'address', 'parcel_ids', 'created_at', 'updated_at']
})
