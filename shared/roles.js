export const ROLES = {
  owner: 'owner',
  operator: 'operator',
  updateOperator: 'updateOperator',
  approvalForAll: 'approvalForAll',
  updateManager: 'updateManager'
}

export const ACTIONS = {
  transfer: 'transfer',
  createEstate: 'createEstate',
  sell: 'sell',
  bid: 'bid',
  buy: 'buy',
  cancelSale: 'cancelSale',
  getMortgage: 'getMortgage',
  setOperatorForAll: 'setOperatorForAll',
  setUpdateOperator: 'setUpdateOperator',
  setUpdateManager: 'setUpdateManager',
  setOperator: 'setOperator',
  updateMetadata: 'updateMetadata'
}

const ROLE_ACTIONS = {
  [ROLES.owner]: Object.values(ACTIONS),
  [ROLES.approvalForAll]: [
    ACTIONS.transfer,
    ACTIONS.createEstate,
    ACTIONS.setUpdateOperator,
    ACTIONS.setUpdateManager,
    ACTIONS.updateMetadata
  ],
  [ROLES.updateManager]: [ACTIONS.setUpdateOperator, ACTIONS.updateMetadata],
  [ROLES.operator]: [
    ACTIONS.transfer,
    ACTIONS.createEstate,
    ACTIONS.setUpdateOperator,
    ACTIONS.updateMetadata
  ],
  [ROLES.updateOperator]: [ACTIONS.updateMetadata]
}

const UNOWNED_ACTIONS = [ACTIONS.bid, ACTIONS.buy, ACTIONS.getMortgage]

/**
 * Checks to see if a wallet can perform an action on an asset
 * It's a shorthand for getting the list of roles an address has for an asset,
 * and then checking if any of those are allowed to peform the action
 * @param  {ACTIONS[keyof ACTIONS]} action - A value from the ACTIONS object
 * @param  {string} address - Wallet address
 * @param  {Asset} asset - Asset you're checking against
 * @return {boolean}
 */
export function can(action, address, asset) {
  const roles = getRoles(address, asset)
  return isAllowedTo(roles, action)
}

/**
 * Check if any role on a list can perform an action
 * @param  {ROLES[keyof ROLES][]}   roles - A list of roles from the ROLES object
 * @param  {ACTIONS[keyof ACTIONS]} action - A value from the ACTIONS object
 * @return {boolean}
 */
export function isAllowedTo(roles, action) {
  if (UNOWNED_ACTIONS.includes(action)) {
    // WARN: break early here. In this cases we check the lack of a role
    return !roles.includes(ROLES.owner)
  }

  let allowedActions = new Set([])
  for (const role of roles) {
    getAllowedActions(role).forEach(action => allowedActions.add(action))
  }

  return allowedActions.has(action)
}

/**
 * Returns the actions a role can perform
 * @param  {ROLES[keyof ROLES]} role - A value from the ROLES object
 * @return {ROLE_ACTIONS[keyof ROLE_ACTIONS]}
 */
export function getAllowedActions(role) {
  return ROLE_ACTIONS[role] || []
}

/**
 * Returns the list of roles the address has on a particular asset
 * @param  {string} address - Wallet address
 * @param  {Asset} asset - Asset you're checking against
 * @return {ROLES[keyof ROLES][]}
 */
export function getRoles(address, asset) {
  if (!address || !asset) {
    return []
  }

  const roles = []
  if (address === asset.owner) {
    roles.push(ROLES.owner)
  }
  if (address === asset.operator) {
    roles.push(ROLES.operator)
  }
  if (address === asset.update_operator) {
    roles.push(ROLES.updateOperator)
  }
  if (asset.approvals_for_all.includes(address)) {
    roles.push(ROLES.approvalForAll)
  }
  if (asset.update_managers.includes(address)) {
    roles.push(ROLES.updateManager)
  }
  return roles
}

/**
 * Returns an array of string with all addresses that have a role on a certain asset
 * It'll pull the data from properties like `operator`, `update_operator`, etc
 * @param  {Asset} asset - Asset you're checking against
 * @return {string[]}
 */
export function flattenRoleAddresses(asset) {
  const addresses = new Set([
    ...asset.update_managers,
    ...asset.approvals_for_all
  ])

  if (asset.operator) {
    addresses.add(asset.operator)
  }
  if (asset.update_operator) {
    addresses.add(asset.update_operator)
  }

  return Array.from(addresses)
}

/**
 * Check if an owneable item is owned by an address
 * @param  {string}  address
 * @param  {object}  owneable - object with an `owner` property
 * @return {Boolean}
 */
export function isOwner(address, owneable) {
  if (!address || !owneable) {
    return false
  }
  return address === owneable.owner
}
