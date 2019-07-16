export const ROLES = {
  owner: 'owner',
  operator: 'operator',
  updateOperator: 'updateOperator',
  operatorForAll: 'operatorForAll',
  updateManager: 'updateManager'
}

export const ACTIONS = {
  transfer: 'transfer',
  createEstate: 'createEstate',
  sell: 'sell',
  bid: 'bid',
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
  [ROLES.operatorForAll]: [
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

export function can(action, address, asset) {
  const roles = getRoles(address, asset)
  return isAllowedTo(roles)
}

export function isAllowedTo(roles, action) {
  if (UNOWNED_ACTIONS.includes(action)) {
    // WARN: break early here. In this cases we check the lack of a role
    return !roles.includes(ROLES.owner)
  }
  let allowedActions = []

  for (const role of roles) {
    allowedActions = allowedActions.concat(getAllowedActions(role))
  }

  return allowedActions.includes(action)
}

export function getAllowedActions(role) {
  return ROLE_ACTIONS[role] || []
}

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
  if (asset.operators_for_all.includes(address)) {
    roles.push(ROLES.operatorForAll)
  }
  if (asset.update_managers.includes(address)) {
    roles.push(ROLES.updateManagers)
  }
  return roles
}

/**
 * Check if an owneable item is owned by an address
 * @param  {string}  address
 * @param  {object}  owneable - object with an `owner` property
 * @return {Boolean}
 */
export function isOwner(address, owneable) {
  return address && owneable && address === owneable.owner
}
