export const blacklist = Object.freeze({
  parcel: ['asset_id', 'created_at', 'updated_at'],
  publication: ['asset_id', 'created_at', 'updated_at'],
  contribution: ['message', 'signature', 'created_at', 'updated_at'],
  district: ['disabled', 'address', 'parcel_ids', 'created_at', 'updated_at']
})
