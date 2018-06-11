import { txUtils } from 'decentraland-eth'

export const ASSET_TYPE = Object.freeze({
  estate: 'estate',
  parcel: 'parcel'
})

export function isExpired(expires_at) {
  return parseInt(expires_at, 10) < Date.now()
}

/**
 - * Returns if object is Open	+ * Returns if object is Open and not expired
 * @param {object} - obj with status & tx_status fields	  * @param {object} - obj with status & tx_status fields
 * @param  {string} - status	  * @param  {string} - status
 * @returns {boolean}	  * @returns {boolean}
 */
export function isOpen(obj, status) {
  return hasStatus(obj, status) && !isExpired(obj.expires_at)
}

export function hasStatus(obj, status) {
  return (
    obj &&
    status.includes(obj.status) &&
    obj.tx_status === txUtils.TRANSACTION_STATUS.confirmed
  )
}
